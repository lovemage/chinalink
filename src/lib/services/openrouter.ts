import type { AiChatMessage, AiContextSnapshot, AiPostDoc } from '@/lib/queries/ai-chat'
import { rankDocs } from '@/lib/ai-chat/retrieval'
import { partnerCases, sihuiJadeCase } from '@/lib/content/supply-chain'
import { getSiteUrl } from '@/lib/posts/constants'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const BODY_EXCERPT_CHARS = 1600

/**
 * The fixed core. Admin prompts from the settings page are appended after it and
 * cannot override it, so an outdated admin prompt can't bring back retired services.
 */
export const CORE_PROMPT = `
你是「懂陸姐 ChinaLink」網站的 AI 助理，代表 Tina（陳郁芷）的網站回答讀者問題。

【網站是什麼】
懂陸姐是 Tina 的個人品牌與產業內容網站，讀者以台灣的經營者與從業者為主。網站有四個欄目：
1. 陸姐觀點：Tina 對大陸電商、零售、產業供應鏈與新媒體的觀察和判斷。
2. 供應鏈觀察：產業帶與供應鏈動態，每篇附日期與資料來源。
3. 問題與交流：讀者常見問題的整理。
4. 顧問服務：讀者需要實際協助時的入口。
文章分四類：電商與平台、零售與消費、To B 與產業供應鏈、新媒體與流量。

【懂陸姐的角色：三種顧問】
被問到「你們提供什麼服務」「懂陸姐能幫什麼忙」這類問題時，只用下面三個角色回答，不要列舉代購、代充值、代付款、驗證碼、帳號代辦等項目，也不要報任何價格：
1. 企業顧問：協助台灣企業與經營者判斷大陸市場、規劃進入與落地，例如公司設立、平台與新媒體經營的方向。
2. 供應鏈顧問：協助找貨源、認識產業帶與分工、把規格與報告寫清楚、核對供應商說法，網站上的培育鑽、翡翠、台灣茶、水晶都是實際整理過的產業。
3. 兩岸對接交流顧問：協助台灣與大陸兩邊的買家、品牌、工廠與合作夥伴互相認識、溝通與對接。
三種角色都依個案討論，費用與時程要先了解需求才能說明。下一步一律是到聯絡頁留下需求，或透過官方 LINE 聯繫。

【你能回答的問題】
1. 站內文章的內容：依「相關文章內容」回答，並附上那篇文章的網址讓讀者延伸閱讀。
2. 大陸市場、產業帶、貨源、供應鏈、電商與新媒體這些網站涵蓋的主題：先用站內文章回答；站內沒寫到的，只能說明網站目前沒有整理這個主題，建議讀者留言或聯繫，不要自己補充站外知識。
3. 懂陸姐的顧問角色與合作方式。
4. 網站上既有的商品或服務：讀者指名問到時，只提供該頁網址，細節與報價請讀者看頁面或聯繫官方 LINE。
與網站無關的問題（政治、醫療、法律判斷、投資建議、寫程式、翻譯、一般閒聊）用一到兩句說明你只回答懂陸姐網站相關的問題，再附一個欄目網址，不要硬找不相關的文章來湊。

【回答方式】
1. 台灣繁體中文，像熟悉當地的前輩說話：具體、有判斷、不賣弄，不誇大。
2. 精簡：一般 150 字內，引用文章內容時最多 300 字。先直接回答，最後給一個下一步（讀哪篇、看哪個欄目，或聯繫顧問），連結最多附兩個。
3. 文章裡的數字、日期、來源要照原文，並說明出處，例如「依文章引述的某某報導」。文章沒有的數字一律不要提。
4. 讀者的需求不清楚時，只問一個最關鍵的問題，不要連續追問。
5. 純文字輸出，不用 Markdown（不要 **、#、- 開頭、[文字](網址)）。條列用 1. 2. 3.，強調用「」。
6. 網址只能用「可用網址」清單裡的，直接貼完整網址，不要自己組合或猜測網址。
7. 不要捏造案例、客戶、價格、時程、保證或合作關係。不知道就說不知道，並引導到聯絡頁或官方 LINE。
`.trim()

interface OpenRouterInput {
  apiKey: string
  model: string
  /** Supplementary rules from the settings page; never overrides CORE_PROMPT. */
  adminNotes: string
  userMessage: string
  history: AiChatMessage[]
  lineOfficialUrl?: string
  lineOfficialId?: string
  whatsappUrl?: string
  context: AiContextSnapshot
}

function postLine(post: AiPostDoc): string {
  const meta = [post.section, post.category, post.date].filter(Boolean).join('｜')
  return `・${post.title}（${meta}）${post.url}\n  摘要：${post.excerpt}`
}

function relatedPostBlock(post: AiPostDoc): string {
  const body = post.body.length > BODY_EXCERPT_CHARS ? `${post.body.slice(0, BODY_EXCERPT_CHARS)}…` : post.body
  const faq = post.faq.map((item) => `問：${item.question}\n答：${item.answer}`).join('\n')
  return [
    `《${post.title}》${post.url}`,
    `欄目：${post.section}｜分類：${post.category}｜日期：${post.date}`,
    post.sources.length ? `資料來源：${post.sources.join('；')}` : '',
    `內文節錄：${body}`,
    faq ? `文章 FAQ：\n${faq}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

/** The site's own pages the assistant may link to, plus partner sites. */
export function sitePages(base = getSiteUrl()) {
  return [
    { label: '首頁', url: base },
    { label: '陸姐觀點', url: `${base}/blog` },
    { label: '供應鏈觀察', url: `${base}/observations` },
    { label: '問題與交流', url: `${base}/questions` },
    { label: '顧問服務', url: `${base}/services` },
    { label: '供應鏈推薦', url: `${base}/supply-chain` },
    { label: sihuiJadeCase.title, url: `${base}${sihuiJadeCase.href}` },
    { label: '關於懂陸姐', url: `${base}/about` },
    { label: '聯絡我們（留下需求）', url: `${base}/contact` },
  ]
}

export function buildSystemPrompt(input: Omit<OpenRouterInput, 'apiKey' | 'model' | 'history'> & { query: string }) {
  const { context, query } = input
  const related = rankDocs(query, context.posts, 3)

  const contact = [
    input.lineOfficialUrl ? `官方 LINE：${input.lineOfficialUrl}` : '',
    input.lineOfficialId ? `LINE ID：${input.lineOfficialId}` : '',
    input.whatsappUrl ? `WhatsApp：${input.whatsappUrl}` : '',
  ].filter(Boolean)

  const partners = partnerCases.map(
    (item) => `・${item.name}（${item.industry}）${item.url}：${item.summary}`,
  )

  const sections = [
    CORE_PROMPT,
    input.adminNotes.trim()
      ? `【管理員補充說明】（與上方規則衝突時，以上方規則為準）\n${input.adminNotes.trim()}`
      : '',
    `【可用網址：站內頁面】\n${sitePages().map((page) => `・${page.label}：${page.url}`).join('\n')}`,
    contact.length ? `【官方聯絡方式】\n${contact.join('\n')}` : '',
    `【供應鏈推薦頁的合作品牌】（${getSiteUrl()}/supply-chain）\n${partners.join('\n')}\n・${sihuiJadeCase.title}：${sihuiJadeCase.description}`,
    related.length
      ? `【相關文章內容】（依讀者這次的問題挑出，回答時優先使用）\n${related.map(relatedPostBlock).join('\n\n')}`
      : '',
    `【全部已發布文章】\n${context.posts.map(postLine).join('\n')}`,
    context.siteFaqs.length
      ? `【問題與交流】\n${context.siteFaqs
          .map((faq) => `問：${faq.question}\n答：${faq.answer}${faq.relatedUrl ? `\n延伸閱讀：${faq.relatedUrl}` : ''}`)
          .join('\n')}`
      : '',
    context.services.length
      ? `【顧問服務頁上的項目】（讀者指名問到才提供網址）\n${context.services.map((s) => `・${s.title}：${s.url}`).join('\n')}`
      : '',
    context.products.length
      ? `【商品頁】（讀者指名問到才提供網址，不要主動推薦）\n${context.products.map((p) => `・${p.title}：${p.url}`).join('\n')}`
      : '',
  ]
  return sections.filter(Boolean).join('\n\n')
}

export async function askOpenRouter(input: OpenRouterInput): Promise<string> {
  const { apiKey, model, userMessage, history } = input
  // Rank on the latest question plus the previous one, so follow-ups like「那價格呢」keep their topic.
  const previousQuestion = [...history].reverse().find((message) => message.role === 'user')?.content ?? ''
  const system = buildSystemPrompt({ ...input, query: `${userMessage} ${previousQuestion}` })

  const messages = [
    { role: 'system', content: system },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const resp = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': getSiteUrl(),
      'X-Title': 'ChinaLink AI Assistant',
    },
    body: JSON.stringify({ model, messages, temperature: 0.3 }),
    cache: 'no-store',
    signal: AbortSignal.timeout(90_000),
  })

  if (!resp.ok) {
    throw new Error(`OpenRouter request failed (${resp.status})`)
  }

  const data = (await resp.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('OpenRouter returned empty response')
  }
  return content
}
