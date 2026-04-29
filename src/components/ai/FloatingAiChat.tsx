'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
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
const URL_REGEX = /(https?:\/\/[^\s]+)/g

function LinkAiIcon() {
  return (
    <Image
      src="/linkai-floating.png"
      alt="LinkAI 客服"
      width={64}
      height={64}
      priority
      className="h-full w-full rounded-full object-cover"
    />
  )
}

export function FloatingAiChat() {
  const pathname = usePathname()
  const router = useRouter()
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
    if (!isLoggedIn || isCheckoutRoute) return

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
  }, [isLoggedIn, isCheckoutRoute])

  useEffect(() => {
    sessionStorage.setItem(OPEN_KEY, open ? '1' : '0')
  }, [open])

  useEffect(() => {
    if (isCheckoutRoute) return
    function handleOpen() {
      if (!isLoggedIn) {
        router.push('/login')
        return
      }
      setOpen(true)
    }
    window.addEventListener('linkai:open', handleOpen)
    return () => window.removeEventListener('linkai:open', handleOpen)
  }, [isLoggedIn, isCheckoutRoute, router])

  useEffect(() => {
    if (!messages.length) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)))
  }, [messages])

  useEffect(() => {
    if (!open) return
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [open, messages, typingLength])

  useEffect(() => {
    if (!open || !isLoggedIn || isCheckoutRoute) return

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
  }, [open, isLoggedIn, isCheckoutRoute])

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
    return parts.map((part, idx) => {
      if (part.match(URL_REGEX)) {
        return (
          <a
            key={`${part}-${idx}`}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="underline break-all text-sky-700"
          >
            {part}
          </a>
        )
      }
      return <span key={`${idx}-${part.slice(0, 8)}`}>{part}</span>
    })
  }

  async function sendMessage() {
    if (sending) return
    const text = input.trim()
    if (!text) return

    setInput('')
    setSending(true)
    setError('')
    try {
      const resp = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
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

  if (isLoggedIn && config && !config.enabled) return null

  return (
    <>
      {!open ? (
        <div className="fixed bottom-24 right-6 z-40 rounded-full border border-brand-primary/20 bg-white px-3 py-1.5 text-sm text-brand-text shadow-md">
          我是客服人員，可以解答您的需求～
        </div>
      ) : null}
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => {
          if (!isLoggedIn) {
            router.push('/login')
            return
          }
          setOpen((v) => !v)
        }}
        className={`fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-brand-primary/25 bg-brand-bg shadow-lg transition-all duration-200 ${
          open ? 'ring-4 ring-brand-primary/35' : ''
        }`}
        style={{
          boxShadow: open
            ? '0 0 28px rgba(194, 117, 74, 0.45), 0 12px 28px rgba(44, 38, 33, 0.22)'
            : '0 0 18px rgba(194, 117, 74, 0.3), 0 10px 24px rgba(44, 38, 33, 0.2)',
        }}
        aria-label="LinkAI 客服"
      >
        <LinkAiIcon />
      </button>

      {open ? (
        <section
          ref={chatPanelRef}
          className="fixed bottom-24 right-5 z-40 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-brand-primary/15 bg-brand-bg shadow-2xl"
        >
          <header className="border-b border-brand-primary/12 bg-brand-primary/8 px-4 py-3">
            <p className="text-sm font-semibold text-brand-text">LinkAI 智能客服</p>
            <p className="text-xs text-brand-muted">僅回答站內商品、服務與下單相關問題</p>
          </header>

          <div className="h-80 space-y-2 overflow-y-auto bg-brand-bg px-4 py-3">
            {loading ? <p className="text-xs text-brand-muted">載入對話中...</p> : null}
            {loading || sending ? (
              <p className="text-xs text-brand-primary">
                ai-在檢索中{'.'.repeat(dotCount)}
              </p>
            ) : null}
            {!messages.length && !loading ? (
              <p className="text-xs text-brand-muted">
                歡迎使用 LinkAI，請輸入您想了解的商品或服務問題。
              </p>
            ) : null}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === 'user'
                    ? 'ml-auto bg-brand-primary text-white'
                    : 'bg-white text-brand-text shadow-sm border border-brand-primary/10'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {renderTextWithLinks(
                    m.id === typingMessageId && m.role === 'assistant'
                      ? m.content.slice(0, typingLength)
                      : m.content,
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-2 border-t border-brand-primary/12 p-3">
            {error ? <p className="text-xs text-brand-cta">{error}</p> : null}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void sendMessage()
                  }
                }}
                placeholder="請輸入商品或服務相關問題..."
                className="flex-1 rounded-xl border border-brand-primary/20 bg-white px-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={sending}
                className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-brand-primary/90 transition-colors"
              >
                {sending ? 'AI檢索中' : '送出'}
              </button>
            </div>
            <div className="flex gap-3 text-xs text-brand-muted">
              {config?.lineOfficialUrl ? (
                <a
                  href={config.lineOfficialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-primary underline"
                >
                  官方 LINE
                </a>
              ) : null}
              {config?.whatsappUrl ? (
                <a
                  href={config.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-primary underline"
                >
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
