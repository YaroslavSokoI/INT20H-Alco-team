import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();

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

  await knex.raw(`
    CREATE INDEX idx_orders_state ON orders ((jurisdictions->>'state'));
  `);
  await knex.raw(`
    CREATE INDEX idx_orders_city ON orders ((jurisdictions->>'city'));
  `);
  await knex.raw(`
    CREATE INDEX idx_orders_timestamp ON orders (timestamp);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('orders');
}
