import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '../env'
import * as schema from './schema'

/**
 * Cria conexão com Postgres.
 */
const connection = postgres(env.DATABASE_URL)
export const db = drizzle(connection, { schema })
