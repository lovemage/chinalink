import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URI!

// One pool per process: routes, the schedule timer and dev hot reloads all share it.
const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres> }
const client = globalForDb.pgClient ?? postgres(connectionString, { prepare: false })
globalForDb.pgClient = client

export const db = drizzle(client, { schema })
