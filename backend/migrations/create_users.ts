import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('users');
  if (hasTable) return;
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('login', 100).notNullable().unique();
    table.string('password', 255).notNullable();
    table.enu('role', ['admin', 'manager']).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
