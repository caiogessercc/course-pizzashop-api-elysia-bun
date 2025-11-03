import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { env } from '../env'
import chalk from 'chalk'

/**
 * Script de migrations para Drizzle + PostgresJS.
 *
 * Observações:
 * - `max: 1` evita problemas de conexões múltiplas simultâneas durante execuções de migrator.
 * - Não deixe `process.exit` sem encerrar a conexão; aqui encerramos antes de `process.exit`.
 * - Use `top-level await` (arquivo em ES Module / target ESNext) para simplicidade.
 *
 */
const connection = postgres(env.DATABASE_URL, { max: 1 })
const db = drizzle(connection)

await migrate(db, { migrationsFolder: 'drizzle' })

console.log(chalk.green('Migrations applied successfully'))

await connection.end()

console.log(chalk.gray('Connection closed'))

process.exit(0)
