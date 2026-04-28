/**
 * Backfill posts.content JSONB from legacy Payload block tables.
 *
 * Usage:
 *   DATABASE_URI=postgresql://... npx tsx src/scripts/backfill-post-content.ts
 *   DATABASE_URI=postgresql://... npx tsx src/scripts/backfill-post-content.ts --apply
 *
 * Flags:
 *   --apply             Persist updates (default is dry-run)
 *   --include-non-array Also target posts where content is not an array (e.g. tiptap doc)
 *   --only=1,2,3        Restrict to specific post IDs
 */

import postgres from 'postgres'

type Row = Record<string, unknown>
type JsonObj = Record<string, unknown>

const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.error('ERROR: DATABASE_URI environment variable is required')
  process.exit(1)
}

const sql = postgres(connectionString, { prepare: false })

const APPLY = process.argv.includes('--apply')
const INCLUDE_NON_ARRAY = process.argv.includes('--include-non-array')
const ONLY_ARG = process.argv.find((a) => a.startsWith('--only='))
const ONLY_IDS = ONLY_ARG
  ? ONLY_ARG
      .slice('--only='.length)
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((n) => Number.isInteger(n) && n > 0)
  : []

function parseJson(value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (typeof value === 'object') return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }
  return null
}

function toInt(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const n = Number(value)
  if (!Number.isInteger(n)) return null
  return n
}

function toText(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const s = String(value)
  return s.length > 0 ? s : null
}

function compact<T extends JsonObj>(obj: T): T {
  const entries = Object.entries(obj).filter(([, value]) => value !== undefined)
  return Object.fromEntries(entries) as T
}

async function queryRows(query: string, params?: unknown[]): Promise<Row[]> {
  return (await sql.unsafe(query, (params || []) as any[])) as Row[]
}

async function main() {
  const targetWhere = INCLUDE_NON_ARRAY
    ? 'content IS NULL OR jsonb_typeof(content) <> $$array$$'
    : 'content IS NULL'

  const baseQuery = `
    SELECT id, slug, status, jsonb_typeof(content) AS content_type
    FROM posts
    WHERE ${targetWhere}
    ORDER BY id
  `

  const baseRows = await queryRows(baseQuery)
  const targetRows =
    ONLY_IDS.length > 0 ? baseRows.filter((r) => ONLY_IDS.includes(Number(r.id))) : baseRows

  if (targetRows.length === 0) {
    console.log('No target posts found. Nothing to do.')
    await sql.end()
    return
  }

  const postIds = targetRows.map((r) => Number(r.id))
  console.log(`Target posts: ${postIds.join(', ')}`)
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}`)

  const topTables = [
    'posts_blocks_callout',
    'posts_blocks_cta',
    'posts_blocks_divider',
    'posts_blocks_embed',
    'posts_blocks_faq',
    'posts_blocks_hero_section',
    'posts_blocks_image',
    'posts_blocks_image_gallery',
    'posts_blocks_quote',
    'posts_blocks_rich_text',
    'posts_blocks_step_guide',
    'posts_blocks_table',
  ]

  const topRows: Array<Row & { _source: string }> = []
  for (const table of topTables) {
    const rows = await queryRows(
      `SELECT *, $$${table}$$ AS _source FROM "${table}" WHERE _parent_id = ANY($1::int[]) ORDER BY _parent_id, _order`,
      [postIds]
    )
    for (const row of rows) topRows.push(row as Row & { _source: string })
  }

  const parentBlockIds = Array.from(
    new Set(topRows.map((r) => String(r.id)).filter((id) => id.length > 0))
  )

  const faqItems =
    parentBlockIds.length > 0
      ? await queryRows(
          'SELECT * FROM "posts_blocks_faq_items" WHERE _parent_id = ANY($1::text[]) ORDER BY _parent_id, _order',
          [parentBlockIds]
        )
      : []
  const galleryImages =
    parentBlockIds.length > 0
      ? await queryRows(
          'SELECT * FROM "posts_blocks_image_gallery_images" WHERE _parent_id = ANY($1::text[]) ORDER BY _parent_id, _order',
          [parentBlockIds]
        )
      : []
  const stepGuideSteps =
    parentBlockIds.length > 0
      ? await queryRows(
          'SELECT * FROM "posts_blocks_step_guide_steps" WHERE _parent_id = ANY($1::text[]) ORDER BY _parent_id, _order',
          [parentBlockIds]
        )
      : []
  const tableHeaders =
    parentBlockIds.length > 0
      ? await queryRows(
          'SELECT * FROM "posts_blocks_table_headers" WHERE _parent_id = ANY($1::text[]) ORDER BY _parent_id, _order',
          [parentBlockIds]
        )
      : []
  const tableRows =
    parentBlockIds.length > 0
      ? await queryRows(
          'SELECT * FROM "posts_blocks_table_rows" WHERE _parent_id = ANY($1::text[]) ORDER BY _parent_id, _order',
          [parentBlockIds]
        )
      : []

  const tableRowIds = tableRows.map((r) => String(r.id)).filter(Boolean)
  const tableCells =
    tableRowIds.length > 0
      ? await queryRows(
          'SELECT * FROM "posts_blocks_table_rows_cells" WHERE _parent_id = ANY($1::text[]) ORDER BY _parent_id, _order',
          [tableRowIds]
        )
      : []

  const imageIds = new Set<number>()
  for (const row of topRows) {
    if (row._source === 'posts_blocks_hero_section') {
      const mediaId = toInt(row.background_image_id)
      if (mediaId) imageIds.add(mediaId)
    }
    if (row._source === 'posts_blocks_image') {
      const mediaId = toInt(row.image_id)
      if (mediaId) imageIds.add(mediaId)
    }
  }
  for (const row of galleryImages) {
    const mediaId = toInt(row.image_id)
    if (mediaId) imageIds.add(mediaId)
  }
  for (const row of stepGuideSteps) {
    const mediaId = toInt(row.screenshot_id)
    if (mediaId) imageIds.add(mediaId)
  }

  const mediaRows =
    imageIds.size > 0
      ? await queryRows(
          'SELECT id, url, alt, width, height, filename, mime_type, filesize, thumbnail_u_r_l, sizes_card_url, sizes_hero_url FROM media WHERE id = ANY($1::int[])',
          [Array.from(imageIds)]
        )
      : []

  const mediaMap = new Map<number, JsonObj>()
  for (const media of mediaRows) {
    const id = Number(media.id)
    mediaMap.set(
      id,
      compact({
        id,
        url: toText(media.url),
        alt: toText(media.alt),
        width: toInt(media.width),
        height: toInt(media.height),
        filename: toText(media.filename),
        mimeType: toText(media.mime_type),
        filesize: toInt(media.filesize),
        thumbnailUrl: toText(media.thumbnail_u_r_l),
        cardUrl: toText(media.sizes_card_url),
        heroUrl: toText(media.sizes_hero_url),
      })
    )
  }

  const byParent = (rows: Row[]) => {
    const map = new Map<string, Row[]>()
    for (const row of rows) {
      const parent = String(row._parent_id)
      const list = map.get(parent)
      if (list) list.push(row)
      else map.set(parent, [row])
    }
    return map
  }

  const faqItemsByBlock = byParent(faqItems)
  const galleryImagesByBlock = byParent(galleryImages)
  const stepGuideByBlock = byParent(stepGuideSteps)
  const tableHeadersByBlock = byParent(tableHeaders)
  const tableRowsByBlock = byParent(tableRows)
  const tableCellsByRow = byParent(tableCells)

  const topRowsByPost = new Map<number, Array<Row & { _source: string }>>()
  for (const row of topRows) {
    const postId = Number(row._parent_id)
    const list = topRowsByPost.get(postId)
    if (list) list.push(row)
    else topRowsByPost.set(postId, [row])
  }

  let touched = 0
  for (const post of targetRows) {
    const postId = Number(post.id)
    const rows = topRowsByPost.get(postId) || []

    const blocks = rows.map((row) => {
      const source = String(row._source)
      const blockId = String(row.id)
      const blockName = toText(row.block_name)

      const mediaFor = (idValue: unknown) => {
        const id = toInt(idValue)
        if (!id) return null
        return mediaMap.get(id) || id
      }

      if (source === 'posts_blocks_hero_section') {
        return compact({
          blockType: 'hero-section',
          id: blockId,
          blockName,
          heading: toText(row.heading),
          subheading: toText(row.subheading),
          backgroundImage: mediaFor(row.background_image_id),
        })
      }

      if (source === 'posts_blocks_rich_text') {
        return compact({
          blockType: 'rich-text',
          id: blockId,
          blockName,
          content: parseJson(row.content),
        })
      }

      if (source === 'posts_blocks_callout') {
        return compact({
          blockType: 'callout',
          id: blockId,
          blockName,
          type: toText(row.type),
          content: parseJson(row.content),
        })
      }

      if (source === 'posts_blocks_image') {
        return compact({
          blockType: 'image',
          id: blockId,
          blockName,
          image: mediaFor(row.image_id),
          caption: toText(row.caption),
          alignment: toText(row.alignment),
        })
      }

      if (source === 'posts_blocks_image_gallery') {
        const images = (galleryImagesByBlock.get(blockId) || []).map((item) =>
          compact({
            id: toText(item.id),
            image: mediaFor(item.image_id),
            caption: toText(item.caption),
          })
        )

        return compact({
          blockType: 'image-gallery',
          id: blockId,
          blockName,
          layout: toText(row.layout),
          images,
        })
      }

      if (source === 'posts_blocks_quote') {
        return compact({
          blockType: 'quote',
          id: blockId,
          blockName,
          quoteText: toText(row.quote_text),
          source: toText(row.source),
        })
      }

      if (source === 'posts_blocks_faq') {
        const items = (faqItemsByBlock.get(blockId) || []).map((item) =>
          compact({
            id: toText(item.id),
            question: toText(item.question),
            answer: parseJson(item.answer),
          })
        )

        return compact({
          blockType: 'faq',
          id: blockId,
          blockName,
          items,
        })
      }

      if (source === 'posts_blocks_cta') {
        return compact({
          blockType: 'cta',
          id: blockId,
          blockName,
          heading: toText(row.heading),
          description: toText(row.description),
          buttonText: toText(row.button_text),
          buttonLink: toText(row.button_link),
        })
      }

      if (source === 'posts_blocks_step_guide') {
        const steps = (stepGuideByBlock.get(blockId) || []).map((step) =>
          compact({
            id: toText(step.id),
            title: toText(step.title),
            description: parseJson(step.description),
            screenshot: mediaFor(step.screenshot_id),
          })
        )

        return compact({
          blockType: 'step-guide',
          id: blockId,
          blockName,
          steps,
        })
      }

      if (source === 'posts_blocks_table') {
        const headers = (tableHeadersByBlock.get(blockId) || []).map((header) =>
          compact({
            id: toText(header.id),
            label: toText(header.label),
          })
        )

        const rowsForTable = (tableRowsByBlock.get(blockId) || []).map((tableRow) => {
          const cells = (tableCellsByRow.get(String(tableRow.id)) || []).map((cell) =>
            compact({
              id: toText(cell.id),
              value: toText(cell.value),
            })
          )

          return compact({
            id: toText(tableRow.id),
            cells,
          })
        })

        return compact({
          blockType: 'table',
          id: blockId,
          blockName,
          headers,
          rows: rowsForTable,
        })
      }

      if (source === 'posts_blocks_embed') {
        return compact({
          blockType: 'embed',
          id: blockId,
          blockName,
          url: toText(row.url),
          caption: toText(row.caption),
        })
      }

      if (source === 'posts_blocks_divider') {
        return compact({
          blockType: 'divider',
          id: blockId,
          blockName,
        })
      }

      return null
    }).filter(Boolean)

    if (blocks.length === 0) {
      console.log(`post ${postId}: no reconstructable blocks, skipped`)
      continue
    }

    touched++
    console.log(
      `post ${postId} (${String(post.slug)}): ${blocks.length} blocks reconstructed${
        APPLY ? '' : ' [dry-run]'
      }`
    )

    if (APPLY) {
      await sql.unsafe('UPDATE posts SET content = $1::jsonb, updated_at = NOW() WHERE id = $2', [
        blocks,
        postId,
      ])
    }
  }

  console.log(`Done. ${touched} post(s) processed.`)
  await sql.end()
}

main().catch(async (err) => {
  console.error('backfill-post-content failed:', err)
  await sql.end()
  process.exit(1)
})
