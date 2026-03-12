import { seedEmailTemplates } from './emailTemplates'
import { seedPosts } from './posts'
import { seedCatalog } from './catalogSeeder'

async function main() {
  const target = process.argv[2] ?? 'all'

  if (target === 'posts') {
    await seedPosts()
    return
  }

  if (target === 'catalog') {
    await seedCatalog()
    return
  }

  await seedEmailTemplates()
  await seedPosts()
  await seedCatalog()
}

main().catch((error) => {
  console.error('[seed] Failed to run seeds.')
  console.error(error)
  process.exitCode = 1
})
