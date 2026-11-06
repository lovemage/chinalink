import { readdirSync, readFileSync } from 'node:fs'
import postgres from 'postgres'
import { isValidSlug } from '../lib/posts/slug'
import { markdownToTiptap, parseManuscript } from '../lib/posts/markdown'

// Usage: DATABASE_URI=... npx tsx src/scripts/import-supply-chain-articles.ts
// Always creates drafts, and never touches a post whose slug already exists.
// Tina adds cover images, confirms the content and publishes from the admin.
const uri = process.env.DATABASE_URI
if (!uri) throw new Error('DATABASE_URI is required')

const dir = new URL('../../content/supply-chain-articles/', import.meta.url)
const sql = postgres(uri, { prepare: false, max: 1 })

async function main() {
  const files = readdirSync(dir).filter((name) => name.endsWith('.md')).sort()
  let created = 0
  for (const file of files) {
    const { meta, body } = parseManuscript(readFileSync(new URL(file, dir), 'utf8'))
    const slug = String(meta.slug)
    if (!isValidSlug(slug)) throw new Error(`${file}: invalid slug ${slug}`)

    const [existing] = await sql`select id from posts where slug = ${slug}`
    if (existing) {
      console.log(`skip ${slug} (post ${existing.id} already exists)`)
      continue
    }
    const [category] = await sql`select id from categories where slug = ${String(meta.category)}`
    if (!category) throw new Error(`${file}: unknown category ${String(meta.category)}`)

    await sql.begin(async (transaction) => {
      const tx = transaction as unknown as typeof sql
      const [post] = await tx`
        insert into posts (
          title, slug, section, category_id, excerpt, author, status, content,
          seo_title, seo_description, focus_keyword, cover_image_alt, sources, faq
        ) values (
          ${String(meta.title)}, ${slug}, 'observation', ${category.id}, ${String(meta.excerpt)}, '懂陸姐', 'draft',
          ${sql.json(markdownToTiptap(body) as never)},
          ${String(meta.seoTitle)}, ${String(meta.seoDescription)}, ${String(meta.focusKeyword)},
          ${String(meta.coverImageAlt)}, ${sql.json(meta.sources as never)}, ${sql.json(meta.faq as never)}
        ) returning id`
      for (const name of meta.tags as string[]) {
        const tagSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '')
        const [tag] = await tx`
          insert into post_tags (name, slug) values (${name}, ${tagSlug})
          on conflict (slug) do update set name = excluded.name returning id`
        await tx`insert into post_tag_relations (post_id, tag_id) values (${post.id}, ${tag.id}) on conflict do nothing`
      }
    })
    created += 1
    console.log(`draft ${slug}`)
  }
  console.log({ files: files.length, created })
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => sql.end())
