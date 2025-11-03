import { z } from 'zod'

/**
 * Schema de validação das variáveis de ambiente usando Zod.
 *
 * - Validação centralizada evita leituras espalhadas de `process.env` no código.
 * - Garante que `DATABASE_URL` exista, seja uma URL válida e não seja string vazia.
 *
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
})

export const env = envSchema.parse(process.env)
