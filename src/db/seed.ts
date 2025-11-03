import { faker } from "@faker-js/faker";
import { usersTable, restaurantsTable } from "./schema";
import { db } from "./connection";
import chalk from "chalk";

/**
 * Reset database.
 */

await db.delete(usersTable);
await db.delete(restaurantsTable);

console.log(chalk.yellow("Database reset successfully"));

/**
 * Create customers.
 */

await db.insert(usersTable).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: "costumer",
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role: "costumer",
  },
]);

console.log(chalk.green("Customers created successfully"));

/**
 * Create manager.
 */

const [ manager ] = await db.insert(usersTable).values([
  {
    name: faker.person.fullName(),
    email: "admin@manager.com",
    phone: faker.phone.number(),
    role: "manager",
  }
]).returning({ id: usersTable.id });

console.log(chalk.green("Manager created successfully"));


/**
 * Create restaurant.
 */

await db.insert(restaurantsTable).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager?.id,
  }
]);

console.log(chalk.green("Restaurant created successfully"));

console.log(chalk.greenBright("Database seeded successfully"));

process.exit(0);
