import { faker } from '@faker-js/faker'
import { usersTable, restaurantsTable } from './schema'
import { db } from './connection'
import chalk from 'chalk'

/**
 * Script de seed para popular o banco com dados fictícios.
 *
 * Propósito:
 * - Facilitar desenvolvimento e testes locais com dados coerentes (ex: usuário admin fixo).
 * - Ser idempotente: reseta tabelas antes de inserir para evitar conflitos.
 *
 * Observações:
 * - A ordem das operações importa por causa de foreign keys: delete primeiro tabelas dependentes,
 *   depois as referenciadas, ou respeite as constraints (`onDelete` configuradas).
 * - Drizzle `insert(...).returning(...)` retorna um array (mesmo que único item seja inserido),
 *   portanto faça desestruturação para obter o objeto inserido.
 *
 */

/**
 * Reset database (idempotente para desenvolvimento):
 * - Executa deletes em ordem controlada para evitar violação de FK.
 */
await db.delete(usersTable)
await db.delete(restaurantsTable)

console.log(chalk.yellow('Database reset successfully'))

/**
 * Create customers (clientes).
 */

await db.insert(usersTable).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: 'costumer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: 'costumer',
  },
])

console.log(chalk.green('Customers created successfully'))

/**
 * Create manager:
 * - Inserimos um manager com e-mail fixo (ex: admin@manager.com) para testes de login.
 * - Usamos `.returning({ id: usersTable.id })` para obter o id inserido.
 * - Drizzle retorna um array, por isso usar desestruturação.
 *
 */
const [manager] = await db
  .insert(usersTable)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@manager.com',
      phone: faker.phone.number(),
      role: 'manager',
    },
  ])
  .returning({ id: usersTable.id })

console.log(chalk.green('Manager created successfully'))

/**
 * Create restaurant:
 * - Associa o restaurante ao manager via managerId.
 * - Aqui usamos `manager?.id` (pode ser undefined em caso de falha, mas esperamos um id).
 */
await db.insert(restaurantsTable).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager?.id,
  },
])

console.log(chalk.green('Restaurant created successfully'))

console.log(chalk.greenBright('Database seeded successfully'))

process.exit(0)
