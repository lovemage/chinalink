import { db } from '../lib/db'
import { admins } from '../lib/db/schema'
import bcrypt from 'bcryptjs'

async function seedAdmin() {
  const hash = await bcrypt.hash('tina123', 10)
  await db
    .insert(admins)
    .values({
      username: 'admin',
      passwordHash: hash,
    })
    .onConflictDoUpdate({
      target: admins.username,
      set: { passwordHash: hash },
    })
  console.log('Admin user set: admin / tina123')
  process.exit(0)
}

seedAdmin()
