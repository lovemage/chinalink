import { seedEmailTemplates } from './emailTemplates'
import { seedPosts } from './posts'

async function main() {
  const target = process.argv[2] ?? 'all'

  if (target === 'posts') {
    await seedPosts()
    return
  }

  await seedEmailTemplates()
  await seedPosts()
}

main().catch((error) => {
  console.error('[seed] Failed to run seeds.')
  console.error(error)
  process.exitCode = 1
})