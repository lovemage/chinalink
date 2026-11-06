import { publishDueScheduledPosts } from './publish-scheduled'

const CHECK_INTERVAL_MS = 60_000

export async function startSchedulePublisher() {
  if (!process.env.DATABASE_URI) return

  const run = async () => {
    try {
      const { published, failed } = await publishDueScheduledPosts()
      if (published.length || failed.length) {
        console.log(`[schedule] published=${published.join(',') || '-'} failed=${failed.length}`)
      }
    } catch (error) {
      console.error('[schedule] check failed:', error)
    }
  }

  const timer = setInterval(run, CHECK_INTERVAL_MS)
  timer.unref?.()
  void run()
}
