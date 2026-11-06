import { readFileSync } from 'node:fs'
import postgres from 'postgres'
import { homeFaqs } from '../lib/content/faq'

// Usage: DATABASE_URI=... npx tsx src/scripts/apply-redesign-migration.ts
const uri = process.env.DATABASE_URI
if (!uri) throw new Error('DATABASE_URI is required')

const sqlText = readFileSync(new URL('./migrations/2026-11-redesign.sql', import.meta.url), 'utf8')
const sql = postgres(uri, { prepare: false, max: 1 })

async function main() {
  // Production keeps the legacy Payload enum on posts.status. A new enum value
  // cannot be used in the transaction that adds it, so this runs first, on its own.
  const [statusEnum] = await sql`select 1 from pg_type where typname = 'enum_posts_status'`
  if (statusEnum) {
    await sql.unsafe(`ALTER TYPE enum_posts_status ADD VALUE IF NOT EXISTS 'scheduled'`)
  }

  await sql.begin(async (transaction) => {
    const tx = transaction as unknown as typeof sql
    await tx.unsafe(sqlText)
    const [{ count }] = await tx`select count(*)::int as count from site_faqs`
    if (count === 0) {
      for (const [index, faq] of homeFaqs.entries()) {
        await tx`insert into site_faqs (question, answer, sort_order) values (${faq.q}, ${faq.a}, ${index + 1})`
      }
    }
  })
  const [posts] = await sql`select count(*)::int as count from posts`
  const categories = await sql`select name, slug from categories order by sort_order`
  const [faqs] = await sql`select count(*)::int as count from site_faqs`
  console.log({ posts: posts.count, faqs: faqs.count, categories })
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => sql.end())
