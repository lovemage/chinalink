'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  FileJson2,
  LogOut,
  MessageSquarePlus,
  Save,
  Send,
} from 'lucide-react'
import {
  proposalQuestionCount,
  proposalSections,
  exclusiveOption,
} from '@/lib/proposal/questionnaire'

type Draft = {
  respondent: { name: string; role: string; contact: string }
  selections: Record<string, string[]>
  notes: Record<string, string>
  overallNote: string
  others: Record<string, string>
  decisions: Record<string, string>
  priorities: Record<string, string>
}

const storageKey = 'chinalink-website-proposal-draft-v1'
const emptyDraft: Draft = {
  respondent: { name: '', role: '', contact: '' },
  selections: {},
  notes: {},
  overallNote: '',
  others: {}, decisions: {}, priorities: {},
}

export function ProposalQuestionnaire() {
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [ready, setReady] = useState(false)
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submittedAt, setSubmittedAt] = useState('')
  const [saveStatus, setSaveStatus] = useState('草稿載入中')
  const [review, setReview] = useState(false)
  const [partial, setPartial] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        const textMap = (value: unknown): Record<string, string> => value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === 'string')) : {}
        setDraft({ ...emptyDraft, respondent: { ...emptyDraft.respondent, ...textMap(parsed.respondent) },
          selections: Object.fromEntries(Object.entries(parsed.selections || {}).filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].every(x => typeof x === 'string'))),
          notes: textMap(parsed.notes), others: textMap(parsed.others), decisions: textMap(parsed.decisions), priorities: textMap(parsed.priorities), overallNote: typeof parsed.overallNote === 'string' ? parsed.overallNote : '' })
      }
    } catch {
      // A corrupt or unavailable local draft should not block the questionnaire.
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ready || submittedAt) return
    setReview(false)
    try { window.localStorage.setItem(storageKey, JSON.stringify(draft)); setSaveStatus('草稿已儲存於這台裝置') }
    catch { setSaveStatus('無法自動儲存，請下載回答備份') }
  }, [draft, ready, submittedAt])

  const answeredCount = useMemo(
    () => proposalSections.flatMap(s => s.questions).filter(q => draft.selections[q.id]?.length || draft.others[q.id]?.trim()).length,
    [draft.selections, draft.others],
  )
  const completion = Math.round((answeredCount / proposalQuestionCount) * 100)

  function toggleOption(questionId: string, option: string) {
    setDraft((current) => {
      const selected = current.selections[questionId] || []
      const next = selected.includes(option)
        ? selected.filter((item) => item !== option)
        : exclusiveOption(option) || questionId === 'first-priority' ? [option] : [...selected.filter(item => !exclusiveOption(item)), option]

      return {
        ...current,
        selections: { ...current.selections, [questionId]: next },
      }
    })
  }

  function updateRespondent(field: keyof Draft['respondent'], value: string) {
    setDraft((current) => ({
      ...current,
      respondent: { ...current.respondent, [field]: value },
    }))
  }

  async function submitProposal() {
    setSubmitError('')
    if (!draft.respondent.name.trim()) {
      setSubmitError('請先填寫姓名，再送出問卷。')
      document.getElementById('respondent-name')?.focus()
      return
    }
    if (answeredCount === 0) {
      setSubmitError('請至少回答一題，再送出問卷。')
      return
    }

    if (!review) { setReview(true); return }
    if (answeredCount < proposalQuestionCount && !partial) { setSubmitError('請確認部分提交，或完成剩餘題目。'); return }

    setSubmitting(true)
    try {
      const response = await fetch('/api/proposal/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const result = (await response.json()) as {
        success?: boolean
        submittedAt?: string
        error?: string
      }
      if (!response.ok || !result.success) {
        setSubmitError(result.error || '目前無法送出，請稍後再試。')
        return
      }

      try { window.localStorage.removeItem(storageKey) } catch { /* Submission succeeded even if storage is unavailable. */ }
      setSubmittedAt(result.submittedAt || new Date().toISOString())
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError('網路連線異常。草稿仍保留在這台裝置，請稍後再試。')
    } finally {
      setSubmitting(false)
    }
  }

  async function logOut() {
    await fetch('/api/proposal/auth', { method: 'DELETE' })
    window.location.assign('/website-repositioning-survey/login')
  }

  if (submittedAt) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4ecdf] px-6 py-20 text-[#28231f]">
        <section className="w-full max-w-2xl border border-[#d7c8b5] bg-[#fffcf6] p-8 sm:p-14">
          <CheckCircle2 className="size-12 text-[#3f7354]" aria-hidden="true" />
          <p className="mt-8 text-xs font-bold tracking-[0.22em] text-[#9f5d35]">SUBMISSION RECEIVED</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl">問卷已送出</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f6257]">
            完整回答已整理成 JSON，並寄送至指定信箱。感謝您提供網站修改方向與補充說明。
          </p>
          <p className="mt-8 text-sm text-[#84766a]">
            送出時間：{new Date(submittedAt).toLocaleString('zh-TW')}
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f4ecdf] text-[#28231f]">
      <header className="border-b border-[#d7c8b5] bg-[#28231f] text-[#fffaf2]">
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] text-[#dca77f]">CHINALINK · WEBSITE BRIEF</p>
              <p className="mt-1 font-serif text-xl font-bold">懂陸姐網站重新定位</p>
            </div>
            <button
              type="button"
              onClick={logOut}
              className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-[#e8ddd1] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dca77f]"
            >
              <LogOut className="size-4" aria-hidden="true" />
              離開
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-b border-[#d7c8b5] bg-[#ede2d3] px-5 py-7 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <div className="flex items-start justify-between gap-6 lg:block">
            <div className="max-w-sm">
              <p className="text-xs font-bold tracking-[0.18em] text-[#9f5d35]">填寫進度</p>
              <p className="mt-2 font-serif text-3xl font-bold tabular-nums">{completion}%</p>
              <p className="mt-1 text-sm text-[#75675b]">已回答 {answeredCount}／{proposalQuestionCount} 題</p>
            </div>
            <Save className="mt-1 size-5 text-[#8b6b4c] lg:mt-5" aria-hidden="true" />
          </div>
          <div className="mt-5 h-1.5 overflow-hidden bg-[#d7c8b5]" aria-hidden="true">
            <div className="h-full bg-[#9f5d35] transition-[width] duration-300" style={{ width: `${completion}%` }} />
          </div>
          <p role="status" className="mt-3 text-xs leading-5 text-[#75675b]">{saveStatus}</p>
          <label className="mt-4 block lg:hidden">問卷主題<select className="mt-2 w-full p-3" defaultValue="" onChange={e => document.getElementById(e.target.value)?.scrollIntoView()}><option value="" disabled>選擇主題</option>{proposalSections.map(s => <option key={s.id} value={s.id}>{s.eyebrow}</option>)}</select></label>

          <nav aria-label="問卷主題" className="mt-7 hidden border-t border-[#d7c8b5] pt-5 lg:block">
            {proposalSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block border-b border-[#d7c8b5] py-3 text-sm font-medium text-[#66594e] transition-colors hover:text-[#9f5d35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f5d35]"
              >
                {section.eyebrow}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 bg-[#fffcf6] px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
          <section className="max-w-4xl border-b border-[#d7c8b5] pb-14">
            <p className="text-xs font-bold tracking-[0.22em] text-[#9f5d35]">建議書問卷 · 可複選</p>
            <h1 className="mt-5 max-w-3xl font-serif text-[clamp(2.6rem,6vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.04em]">
              網站重新定位
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#6f6257]">
              每題都可以複選。若選項無法完整表達您的想法，請使用每個主題旁的「加註」補充。
            </p>

            <div className="mt-10 grid gap-5 border-y border-[#d7c8b5] py-7 sm:grid-cols-3">
              <label className="block">
                <span className="text-sm font-bold">姓名 *</span>
                <input
                  id="respondent-name"
                  value={draft.respondent.name}
                  onChange={(event) => updateRespondent('name', event.target.value)}
                  className="mt-2 h-12 w-full border border-[#cdbda9] bg-transparent px-3 outline-none transition-colors focus:border-[#9f5d35] focus:ring-2 focus:ring-[#9f5d35]/20"
                  placeholder="填寫人姓名"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold">職稱／角色</span>
                <input
                  value={draft.respondent.role}
                  onChange={(event) => updateRespondent('role', event.target.value)}
                  className="mt-2 h-12 w-full border border-[#cdbda9] bg-transparent px-3 outline-none transition-colors focus:border-[#9f5d35] focus:ring-2 focus:ring-[#9f5d35]/20"
                  placeholder="例如：品牌負責人"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold">聯絡方式</span>
                <input
                  value={draft.respondent.contact}
                  onChange={(event) => updateRespondent('contact', event.target.value)}
                  className="mt-2 h-12 w-full border border-[#cdbda9] bg-transparent px-3 outline-none transition-colors focus:border-[#9f5d35] focus:ring-2 focus:ring-[#9f5d35]/20"
                  placeholder="LINE、Email 或電話"
                />
              </label>
            </div>
          </section>

          <div className="max-w-4xl">
            {proposalSections.map((section) => {
              const noteOpen = openNotes[section.id] ?? Boolean(draft.notes[section.id])
              return (
                <section key={section.id} id={section.id} className="scroll-mt-8 border-b border-[#d7c8b5] py-14 sm:py-20">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">{section.eyebrow}</p>
                      <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">{section.title}</h2>
                      <p className="mt-5 text-base leading-7 text-[#6f6257]">{section.summary}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpenNotes((current) => ({ ...current, [section.id]: !noteOpen }))}
                      aria-expanded={noteOpen}
                      aria-controls={`${section.id}-note`}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-[#bda98f] px-4 text-sm font-bold text-[#70472f] transition-colors hover:bg-[#ede2d3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f5d35]"
                    >
                      <MessageSquarePlus className="size-4" aria-hidden="true" />
                      {draft.notes[section.id] ? '已有加註' : '加註'}
                      <ChevronDown className={`size-4 transition-transform ${noteOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                  </div>

                  <div
                    id={`${section.id}-note`}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${noteOpen ? 'mt-7 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden" inert={!noteOpen}>
                      <label className="block bg-[#f4ecdf] p-5">
                        <span className="text-sm font-bold">本主題補充說明</span>
                        <textarea
                          maxLength={8000}
                          value={draft.notes[section.id] || ''}
                          onChange={(event) => setDraft((current) => ({
                            ...current,
                            notes: { ...current.notes, [section.id]: event.target.value },
                          }))}
                          rows={5}
                          className="mt-3 w-full resize-y border border-[#cdbda9] bg-[#fffcf6] p-4 leading-7 outline-none transition-colors focus:border-[#9f5d35] focus:ring-2 focus:ring-[#9f5d35]/20"
                          placeholder="可補充偏好、限制、實際做法，或選項中沒有涵蓋的內容。"
                        />
                        <p className="text-sm">{(draft.notes[section.id] || '').length} / 8000 字</p>
                      </label>
                    </div>
                  </div>

                  <div className="mt-9 bg-[#28231f] p-6 text-[#fffaf2] sm:p-8">
                    <p className="text-xs font-bold tracking-[0.18em] text-[#dca77f]">修改建議</p>
                    <ul className="mt-5 grid gap-4">
                      {section.recommendations.map((recommendation) => (
                        <li key={recommendation} className="flex gap-3 text-sm leading-6 text-[#eee2d5] sm:text-base">
                          <Check className="mt-1 size-4 shrink-0 text-[#dca77f]" aria-hidden="true" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 space-y-10">
                    <p>已回答 {section.questions.filter(q => draft.selections[q.id]?.length || draft.others[q.id]?.trim()).length} / {section.questions.length} 題</p>
                    <div className="grid gap-4 sm:grid-cols-2">{(['decisions', 'priorities'] as const).map(field => <label key={field}>{field === 'decisions' ? '本主題建議採納' : '實作優先順序'}<select value={draft[field][section.id] || ''} onChange={e => setDraft(current => ({ ...current, [field]: { ...current[field], [section.id]: e.target.value } }))} className="mt-2 w-full border p-3"><option value="">請選擇</option>{(field === 'decisions' ? ['採用', '部分調整', '暫緩', '需討論'] : ['本期必要', '後續考慮', '暫不需要']).map(v => <option key={v}>{v}</option>)}</select></label>)}</div>
                    {section.questions.map((question, questionIndex) => (
                      <fieldset key={question.id}>
                        <legend className="max-w-3xl text-lg font-bold leading-7">
                          <span className="mr-2 text-sm font-medium tabular-nums text-[#9f5d35]">{String(questionIndex + 1).padStart(2, '0')}</span>
                          {question.prompt}
                        </legend>
                        <p className="mt-2 text-xs text-[#88796c]">可複選</p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {question.options.map((option) => {
                            const selected = (draft.selections[question.id] || []).includes(option)
                            return (
                              <label
                                key={option}
                                className={`flex min-h-12 cursor-pointer items-start gap-3 border px-4 py-3 text-sm leading-6 transition-colors focus-within:ring-2 focus-within:ring-[#9f5d35] ${selected ? 'border-[#9f5d35] bg-[#ead8c5] font-bold text-[#472e20]' : 'border-[#d7c8b5] bg-transparent text-[#66594e] hover:bg-[#f4ecdf]'}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleOption(question.id, option)}
                                  className="mt-1 size-4 shrink-0 accent-[#9f5d35]"
                                />
                                <span>{option}</span>
                              </label>
                            )
                          })}
                        </div>
                        <label className="mt-3 block text-sm">其他說明<input maxLength={2000} value={draft.others[question.id] || ''} onChange={e => setDraft(current => ({ ...current, others: { ...current.others, [question.id]: e.target.value } }))} className="mt-2 w-full border border-[#cdbda9] bg-transparent p-3" /></label>
                      </fieldset>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          <section className="max-w-4xl py-14 sm:py-20">
            <p className="text-xs font-bold tracking-[0.2em] text-[#9f5d35]">最後補充</p>
            <h2 className="mt-3 font-serif text-3xl font-bold">整體補充</h2>
            <textarea
              aria-label="整體補充"
              maxLength={12000}
              value={draft.overallNote}
              onChange={(event) => setDraft((current) => ({ ...current, overallNote: event.target.value }))}
              rows={7}
              className="mt-7 w-full resize-y border border-[#cdbda9] bg-[#fffcf6] p-5 leading-7 outline-none transition-colors focus:border-[#9f5d35] focus:ring-2 focus:ring-[#9f5d35]/20"
              placeholder="例如：預算、時程、不能碰的品類、希望保留的既有內容，或對首頁文案的想法。"
            />
            <p className="text-sm">{draft.overallNote.length} / 12000 字</p>
            <button type="button" className="my-5 border p-3" onClick={() => { const url = URL.createObjectURL(new Blob([JSON.stringify({ ...draft, sections: proposalSections }, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'chinalink-questionnaire.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) }}>下載回答備份</button>
            {review && <section className="my-5 border p-5"><h3 className="text-xl font-bold">送出前確認</h3><p>已回答 {answeredCount} 題，未答 {proposalQuestionCount - answeredCount} 題。</p>{proposalSections.map(s => <details key={s.id} className="my-3"><summary>{s.eyebrow}</summary><p>建議採納：{draft.decisions[s.id] || '未選擇'}；優先順序：{draft.priorities[s.id] || '未選擇'}</p>{s.questions.map(q => <p key={q.id} className="my-2">{q.prompt}：{draft.selections[q.id]?.join('、') || '未勾選'} {draft.others[q.id]}</p>)}<p>加註：{draft.notes[s.id] || '無'}</p></details>)}{answeredCount < proposalQuestionCount && <label className="block p-3"><input type="checkbox" checked={partial} onChange={e => setPartial(e.target.checked)} /> 我確認先提交目前回答，未答題留待討論。</label>}</section>}

            <div className="mt-8 border-t border-[#d7c8b5] pt-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 text-sm leading-6 text-[#75675b]">
                  <FileJson2 className="mt-0.5 size-5 shrink-0 text-[#9f5d35]" aria-hidden="true" />
                  <p>送出後會將題目、勾選內容與所有加註整理成完整 JSON 並寄送。</p>
                </div>
                <button
                  type="button"
                  onClick={submitProposal}
                  disabled={submitting}
                  className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-[#9f5d35] px-8 font-bold text-[#fffaf2] transition-colors hover:bg-[#82482a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f5d35] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? '寄送中' : review ? '確認送出問卷' : '檢視回答與送出'}
                  <Send className="size-5" aria-hidden="true" />
                </button>
              </div>
              {submitError && <p role="alert" className="mt-5 bg-[#f8e5df] p-4 text-sm font-bold text-[#9a3326]">{submitError}</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
