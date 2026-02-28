import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
}

export async function down(_knex: Knex): Promise<void> {
  // pg_trgm extension is shared - do not drop it in down migration
}
