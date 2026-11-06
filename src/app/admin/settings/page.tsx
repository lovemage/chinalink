import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { aiAssistantLogs } from '@/lib/db/schema'
import { formatTaipeiDateTime } from '@/lib/posts/time'
import { getSettings } from '@/lib/queries/settings'
import { getInquiries } from '@/lib/queries/inquiries'
import SettingsManager from './SettingsManager'

const LOG_STATUS: Record<string, string> = {
  success: '成功',
  invalid_format: '格式錯誤',
  error: '失敗',
}

export default async function SettingsPage() {
  const [settings, inquiries, logs] = await Promise.all([
    getSettings(),
    getInquiries(),
    db.select().from(aiAssistantLogs).orderBy(desc(aiAssistantLogs.createdAt)).limit(20),
  ])

  return (
    <>
      <SettingsManager settings={settings} inquiries={inquiries} />
      <section className="p-4 md:p-6">
        <h2 className="font-bold">AI 上架助手紀錄</h2>
        <p className="mt-1 text-[13px] text-brand-muted">最近 20 次。助手使用上方的 OpenRouter 金鑰與模型。</p>
        {logs.length === 0 ? (
          <p className="mt-3 text-sm text-brand-muted">還沒有呼叫紀錄。</p>
        ) : (
          <ul className="mt-3 border-t border-brand-rule text-sm">
            {logs.map((log) => (
              <li key={log.id} className="flex flex-wrap gap-x-3 gap-y-0.5 border-b border-brand-rule py-2">
                <span className="dateline">{formatTaipeiDateTime(log.createdAt)}</span>
                <span>{log.username}</span>
                <span>{log.action === 'faq' ? 'FAQ' : '整理文章'}</span>
                <span className={log.status === 'success' ? '' : 'text-brand-alert'}>{LOG_STATUS[log.status] ?? log.status}</span>
                {log.model && <span className="min-w-0 break-all text-brand-muted">{log.model}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
