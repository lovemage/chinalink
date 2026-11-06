export async function register() {
  // The literal check lets the edge build drop the database import.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startSchedulePublisher } = await import('@/lib/posts/schedule-runner')
    await startSchedulePublisher()
  }
}
