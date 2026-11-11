'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { shouldShowAiChat } from '@/lib/ai-chat/visibility'

interface AiMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  createdAt: string | null
}

interface ChatConfig {
  enabled: boolean
  lineOfficialUrl?: string
  lineOfficialId?: string
  whatsappUrl?: string
}

const STORAGE_KEY = 'linkai-chat-session-messages'
const OPEN_KEY = 'linkai-chat-open'
const URL_REGEX = /(https?:\/\/[^\s，。、）」]+)/g
const STARTER_QUESTIONS = [
  '懂陸姐提供哪些顧問服務？',
  '想找大陸貨源，要先準備什麼？',
  '培育鑽批發價為什麼一直跌？',
  '怎麼和懂陸姐聯繫合作？',
]

function LinkAiIcon() {
  return (
    <Image
      src="/linkai-floating.png"
      alt="懂陸姐 AI 助理"
      width={64}
      height={64}
      priority
      className="h-full w-full rounded-full object-cover"
    />
  )
}

export function FloatingAiChat() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [config, setConfig] = useState<ChatConfig | null>(null)
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null)
  const [typingLength, setTypingLength] = useState(0)
  const [dotCount, setDotCount] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const chatPanelRef = useRef<HTMLElement | null>(null)
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null)

  const isLoggedIn = status === 'authenticated' && !!session?.user
  const isCheckoutRoute = pathname ? !shouldShowAiChat(pathname) : false

  useEffect(() => {
    if (isCheckoutRoute) return

    const cachedOpen = sessionStorage.getItem(OPEN_KEY)
    if (cachedOpen === '1') {
      setOpen(true)
    }
    const cached = sessionStorage.getItem(STORAGE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AiMessage[]
        if (Array.isArray(parsed)) setMessages(parsed.slice(-20))
      } catch {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [isCheckoutRoute])

  useEffect(() => {
    sessionStorage.setItem(OPEN_KEY, open ? '1' : '0')
  }, [open])

  useEffect(() => {
    if (isCheckoutRoute) return
    function handleOpen() {
      setOpen(true)
    }
    window.addEventListener('linkai:open', handleOpen)
    return () => window.removeEventListener('linkai:open', handleOpen)
  }, [isCheckoutRoute])

  useEffect(() => {
    if (!messages.length) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)))
  }, [messages])

  useEffect(() => {
    if (!open) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [open, messages, typingLength])

  useEffect(() => {
    if (!open || isCheckoutRoute) return

    let mounted = true
    async function fetchHistory() {
      setLoading(true)
      setError('')
      try {
        const resp = await fetch('/api/ai-chat', { cache: 'no-store' })
        const data = (await resp.json()) as {
          error?: string
          messages?: AiMessage[]
          config?: ChatConfig
        }
        if (!resp.ok) {
          throw new Error(data.error || 'AI 客服暫時無法使用')
        }
        if (!mounted) return
        setConfig(data.config ?? null)
        setMessages((prev) => {
          const base = data.messages ?? []
          if (!prev.length) return base
          const merged = [...base, ...prev]
          const dedup = new Map<number, AiMessage>()
          for (const row of merged) dedup.set(row.id, row)
          return Array.from(dedup.values()).slice(-20)
        })
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'AI 客服暫時無法使用')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void fetchHistory()
    return () => {
      mounted = false
    }
  }, [open, isCheckoutRoute])

  useEffect(() => {
    if (!loading && !sending) return
    const timer = window.setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1)
    }, 380)
    return () => window.clearInterval(timer)
  }, [loading, sending])

  useEffect(() => {
    if (!typingMessageId) return
    const row = messages.find((m) => m.id === typingMessageId && m.role === 'assistant')
    if (!row) {
      setTypingMessageId(null)
      setTypingLength(0)
      return
    }

    setTypingLength(0)
    const fullLen = row.content.length
    const timer = setInterval(() => {
      setTypingLength((prev) => {
        const next = prev + 2
        if (next >= fullLen) {
          clearInterval(timer)
          return fullLen
        }
        return next
      })
    }, 16)

    return () => clearInterval(timer)
  }, [typingMessageId, messages])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null
      if (!target) return
      if (chatPanelRef.current?.contains(target)) return
      if (toggleButtonRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [open])

  function renderTextWithLinks(text: string) {
    const parts = text.split(URL_REGEX)
    const siteOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    return parts.map((part, idx) => {
      if (part.match(URL_REGEX)) {
        const external = !part.startsWith(siteOrigin) && !part.startsWith('https://www.chinalink.tw')
        return (
          <a
            key={`${part}-${idx}`}
            href={part}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="break-all text-brand-text underline decoration-brand-wood decoration-1 underline-offset-4 hover:decoration-2"
          >
            {part}
          </a>
        )
      }
      return <span key={`${idx}-${part.slice(0, 8)}`}>{part}</span>
    })
  }

  async function sendMessage(preset?: string) {
    if (sending) return
    const text = (preset ?? input).trim()
    if (!text) return

    if (!preset) setInput('')
    setSending(true)
    setError('')
    try {
      const resp = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: isLoggedIn ? undefined : messages,
        }),
      })
      const data = (await resp.json()) as {
        error?: string
        messages?: AiMessage[]
      }

      if (!resp.ok) {
        throw new Error(data.error || '訊息送出失敗')
      }
      setMessages((data.messages ?? []).slice(-20))
      const latestAssistant = (data.messages ?? [])
        .slice()
        .reverse()
        .find((m) => m.role === 'assistant')
      setTypingMessageId(latestAssistant?.id ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '訊息送出失敗')
    } finally {
      setSending(false)
    }
  }

  if (isCheckoutRoute) return null

  if (config && !config.enabled) return null

  return (
    <>
      {!open ? (
        <div className="fixed bottom-24 right-6 z-40 max-w-[min(80vw,320px)] bg-brand-deep px-4 py-2 text-sm text-white">
          有問題可以問我：市場、貨源與顧問合作
        </div>
      ) : null}
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v)
        }}
        className={`fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full border bg-brand-bg transition-colors duration-200 ${
          open ? 'border-brand-text' : 'border-brand-rule hover:border-brand-text'
        }`}
        aria-label={open ? '關閉懂陸姐 AI 助理' : '開啟懂陸姐 AI 助理'}
        aria-expanded={open}
      >
        <LinkAiIcon />
      </button>

      {open ? (
        <section
          ref={chatPanelRef}
          aria-label="懂陸姐 AI 助理"
          className="fixed bottom-24 right-4 z-40 flex w-[min(calc(100vw-2rem),400px)] flex-col border border-brand-text bg-brand-bg sm:right-5"
        >
          <header className="bg-brand-deep px-4 py-3 text-white">
            <p className="font-serif text-[15px] font-bold">懂陸姐 AI 助理</p>
            <p className="mt-0.5 text-xs text-brand-tint">依站內文章、供應鏈觀察與問題與交流回答</p>
          </header>

          <div className="h-[min(55vh,360px)] space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {loading ? <p className="text-xs text-brand-muted">載入對話中…</p> : null}
            {!messages.length && !loading ? (
              <div>
                <p className="text-sm leading-7 text-brand-text">
                  我可以幫你找站內文章、說明產業帶與貨源的觀察，也可以介紹懂陸姐的企業、供應鏈與兩岸對接顧問。
                </p>
                <div className="mt-3 flex flex-col items-start gap-2">
                  {STARTER_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      disabled={sending}
                      onClick={() => void sendMessage(question)}
                      className="border border-brand-rule bg-brand-raised px-3 py-2 text-left text-[13px] text-brand-text transition-colors hover:border-brand-text disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[88%] px-3 py-2 text-sm leading-7 ${
                  m.role === 'user'
                    ? 'ml-auto bg-brand-primary text-white'
                    : 'border border-brand-rule bg-brand-raised text-brand-text'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {m.role === 'assistant'
                    ? renderTextWithLinks(
                        m.id === typingMessageId ? m.content.slice(0, typingLength) : m.content,
                      )
                    : m.content}
                </div>
              </div>
            ))}
            {sending ? (
              <p className="text-xs text-brand-muted">
                整理回覆中{'.'.repeat(dotCount)}
              </p>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-2 border-t border-brand-rule p-3">
            {error ? <p className="text-xs text-brand-alert">{error}</p> : null}
            <div className="flex">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    void sendMessage()
                  }
                }}
                placeholder="想問的市場、貨源或合作問題"
                aria-label="輸入問題"
                className="min-w-0 flex-1 border border-r-0 border-brand-rule bg-white px-3 py-2 text-base text-brand-text outline-none placeholder:text-brand-muted focus:border-brand-text sm:text-sm"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={sending}
                className="bg-brand-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-50"
              >
                送出
              </button>
            </div>
            <div className="flex gap-4 text-xs text-brand-muted">
              <a href="/contact" className="text-link">
                留下需求
              </a>
              {config?.lineOfficialUrl ? (
                <a href={config.lineOfficialUrl} target="_blank" rel="noreferrer" className="text-link">
                  官方 LINE
                </a>
              ) : null}
              {config?.whatsappUrl ? (
                <a href={config.whatsappUrl} target="_blank" rel="noreferrer" className="text-link">
                  官方 WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
