import Link from 'next/link'
import { Search } from 'lucide-react'
import { getPostCategoriesAll, getPublishedPostsFiltered } from '@/lib/queries/posts'
import { ARTICLE_CATEGORY_SLUGS, type PostSection } from '@/lib/posts/constants'
import { LeadPost, PostCard, PostRow } from './PostCard'
import { WireList } from './WireList'

interface PostListingProps {
  basePath: string
  layout: 'magazine' | 'wire' | 'grid'
  section?: PostSection
  category?: string
  search?: string
  page?: number
  /** On a category page the filter switches column instead of category. */
  showCategoryFilter?: boolean
}

function buildHref(basePath: string, params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && !(key === 'page' && value === 1)) query.set(key, String(value))
  }
  const text = query.toString()
  return text ? `${basePath}?${text}` : basePath
}

export async function PostListing({
  basePath,
  layout,
  section,
  category,
  search,
  page = 1,
  showCategoryFilter = true,
}: PostListingProps) {
  const [allCategories, { posts, total, totalPages }] = await Promise.all([
    getPostCategoriesAll(),
    getPublishedPostsFiltered({ section, categorySlug: category, search, page }),
  ])
  const categories = allCategories.filter((item) =>
    (ARTICLE_CATEGORY_SLUGS as readonly string[]).includes(item.slug)
  )
  const filtered = Boolean(category || search)
  const usesLead = layout === 'magazine' && !search && page === 1 && posts.length > 1
  const [lead, ...rest] = posts
  const rail = usesLead ? rest.slice(0, 4) : []
  const grid = usesLead ? rest.slice(4) : posts

  const filterClass = (active: boolean) =>
    `shrink-0 px-3.5 py-2 text-sm transition-colors ${
      active ? 'bg-brand-tint font-bold text-brand-text' : 'text-brand-muted hover:text-brand-text'
    }`

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6">
      <div className="flex flex-col gap-3 border-b border-brand-rule py-4 lg:flex-row lg:items-center lg:justify-between">
        {showCategoryFilter ? (
          <nav aria-label="文章分類" className="-mx-1 flex gap-1 overflow-x-auto">
            <Link href={buildHref(basePath, { search })} aria-current={!category ? 'page' : undefined} className={filterClass(!category)}>
              全部
            </Link>
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={buildHref(basePath, { category: item.slug, search })}
                aria-current={category === item.slug ? 'page' : undefined}
                className={filterClass(category === item.slug)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        ) : (
          <span />
        )}
        <form action={basePath} role="search" className="flex w-full items-stretch border border-brand-rule bg-brand-raised lg:w-72">
          {category && showCategoryFilter && <input type="hidden" name="category" value={category} />}
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="搜尋標題或摘要"
            aria-label="搜尋文章"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-brand-muted"
          />
          <button type="submit" aria-label="搜尋" className="flex w-11 items-center justify-center text-brand-text hover:bg-brand-tint">
            <Search className="size-4" aria-hidden="true" />
          </button>
        </form>
      </div>

      {search && (
        <p className="pt-6 text-sm text-brand-muted">
          「{search}」共 {total} 篇
          <Link href={buildHref(basePath, { category })} className="text-link ml-3 text-brand-text">
            清除搜尋
          </Link>
        </p>
      )}

      {posts.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-xl text-brand-text">
            {filtered ? '找不到符合的文章' : '第一批文章整理中'}
          </p>
          {filtered ? (
            <Link href={basePath} className="text-link mt-4 inline-block text-[15px]">
              看全部文章
            </Link>
          ) : (
            <Link href="/blog" className="text-link mt-4 inline-block text-[15px]">
              先讀陸姐觀點
            </Link>
          )}
        </div>
      ) : layout === 'wire' ? (
        <div className="pt-10">
          <WireList posts={posts} headingAs="h2" />
        </div>
      ) : (
        <>
          {usesLead && (
            <div className="grid gap-10 border-b border-brand-rule py-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
              <LeadPost post={lead} />
              {rail.length > 0 && (
                <div>
                  {rail.map((post) => (
                    <PostRow key={post.id} post={post} headingAs="h2" />
                  ))}
                </div>
              )}
            </div>
          )}
          {grid.length > 0 && (
            <div className="grid gap-x-8 gap-y-12 pt-10 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((post) => (
                <PostCard key={post.id} post={post} showSection={layout === 'grid'} />
              ))}
            </div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <nav aria-label="分頁" className="mt-14 flex items-center justify-between border-t border-brand-rule pt-6 text-[15px]">
          {page > 1 ? (
            <Link rel="prev" href={buildHref(basePath, { category, search, page: page - 1 })} className="text-link">
              上一頁
            </Link>
          ) : (
            <span />
          )}
          <span className="dateline text-sm text-brand-muted">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link rel="next" href={buildHref(basePath, { category, search, page: page + 1 })} className="text-link">
              下一頁
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}

export function parsePage(value: string | undefined): number {
  const page = Number.parseInt(value ?? '', 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}
