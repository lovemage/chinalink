import { db } from '../lib/db'
import { admins } from '../lib/db/schema'
import bcrypt from 'bcryptjs'

async function seedAdmin() {
  const hash = await bcrypt.hash('admin123', 10)
  await db.insert(admins).values({
    username: 'admin',
    passwordHash: hash,
  }).onConflictDoNothing()
  console.log('Admin user seeded')
  process.exit(0)
}

seedAdmin()
