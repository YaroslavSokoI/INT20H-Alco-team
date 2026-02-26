import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable('orders');
  if (!hasTable) {
    await knex.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

      table.decimal('latitude', 10, 7).notNullable();
      table.decimal('longitude', 10, 7).notNullable();

      table.decimal('subtotal', 12, 4).notNullable();
      table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now());

      table.decimal('composite_tax_rate', 8, 6).notNullable();
      table.decimal('tax_amount', 12, 4).notNullable();
      table.decimal('total_amount', 12, 4).notNullable();

      table.decimal('state_rate', 8, 6).notNullable().defaultTo(0);
      table.decimal('county_rate', 8, 6).notNullable().defaultTo(0);
      table.decimal('city_rate', 8, 6).notNullable().defaultTo(0);
      table.decimal('special_rates', 8, 6).notNullable().defaultTo(0);

      table.jsonb('jurisdictions').notNullable();

      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    });
  }

  const hasUuid = await knex.schema.hasColumn('orders', 'uuid');
  if (!hasUuid) {
    await knex.schema.alterTable('orders', (table) => {
      table.uuid('uuid').nullable().defaultTo(knex.raw('gen_random_uuid()'));
    });
  }

  await knex.raw(`UPDATE orders SET uuid = gen_random_uuid() WHERE uuid IS NULL`);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_orders_county ON orders ((jurisdictions->>'county'));
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_orders_city ON orders ((jurisdictions->>'city'));
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_orders_timestamp ON orders (timestamp);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('orders');
}
