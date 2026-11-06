import { pinyin } from 'pinyin-pro'

/** Lowercase letters, digits and single hyphens. Applies to new or changed slugs only. */
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidSlug(slug: string): boolean {
  return VALID_SLUG.test(slug)
}

/** 台灣市場觀察 -> tai-wan-shi-chang-guan-cha */
export function titleToSlug(title: string): string {
  const syllables = pinyin(title.normalize('NFKC'), {
    toneType: 'none',
    type: 'array',
    nonZh: 'consecutive',
  })
  return syllables
    .join('-')
    .toLowerCase()
    .replace(/ü/g, 'v')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
    .replace(/-+$/, '')
}

/** Adds -2, -3... until `isTaken` is false. */
export async function resolveUniqueSlug(
  base: string,
  isTaken: (candidate: string) => Promise<boolean>
): Promise<string> {
  const root = base || 'post'
  if (!(await isTaken(root))) return root
  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${root}-${n}`
    if (!(await isTaken(candidate))) return candidate
  }
  throw new Error(`No free slug for ${root}`)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Rewrites links to /blog/<old> inside serialized post content.
 * The lookahead stops /blog/foo from matching /blog/foo-bar.
 */
export function rewriteBlogLinks(serialized: string, oldSlug: string, newSlug: string): string {
  const variants = Array.from(new Set([oldSlug, encodeURI(oldSlug), encodeURIComponent(oldSlug)]))
  return variants.reduce((text, variant) => {
    const pattern = new RegExp(`/blog/${escapeRegExp(variant)}(?=["'?#/\\\\\\s]|$)`, 'g')
    return text.replace(pattern, `/blog/${newSlug}`)
  }, serialized)
}
