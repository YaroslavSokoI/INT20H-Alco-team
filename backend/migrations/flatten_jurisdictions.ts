import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasUuid = await knex.schema.hasColumn('orders', 'uuid');
  if (!hasUuid) {
    await knex.schema.alterTable('orders', (table) => {
      table.uuid('uuid').nullable().defaultTo(knex.raw('gen_random_uuid()'));
    });
    await knex.raw(`UPDATE orders SET uuid = gen_random_uuid() WHERE uuid IS NULL`);
    await knex.schema.alterTable('orders', (table) => {
      table.uuid('uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).alter();
    });
  }

 
  const hasCity = await knex.schema.hasColumn('orders', 'city');
  if (!hasCity) {
    await knex.schema.alterTable('orders', (table) => {
      table.text('city').nullable();
      table.text('county').nullable();
      table.text('state').nullable();
      table.text('postcode').nullable();
    });
  }

 
  const hasJurisdictions = await knex.schema.hasColumn('orders', 'jurisdictions');
  if (hasJurisdictions) {
    await knex.raw(`
      UPDATE orders SET
        city     = jurisdictions->>'city',
        county   = jurisdictions->>'county',
        state    = jurisdictions->>'state',
        postcode = jurisdictions->>'postcode'
    `);
  }


  await knex.schema.alterTable('orders', (table) => {
    table.text('city').notNullable().defaultTo('').alter();
    table.text('county').notNullable().defaultTo('').alter();
    table.text('state').notNullable().defaultTo('').alter();
    table.text('postcode').notNullable().defaultTo('').alter();
  });


  await knex.raw(`DROP INDEX IF EXISTS idx_orders_county`);
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_city`);


  if (hasJurisdictions) {
    await knex.schema.alterTable('orders', (table) => {
      table.dropColumn('jurisdictions');
    });
  }


  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_city   ON orders (city)`);
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_county ON orders (county)`);
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_state  ON orders (state)`);

   await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_uuid_trgm   ON orders USING GIN ((uuid::text) gin_trgm_ops)`);
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_city_trgm   ON orders USING GIN (city    gin_trgm_ops)`);
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_county_trgm ON orders USING GIN (county  gin_trgm_ops)`);
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_state_trgm  ON orders USING GIN (state   gin_trgm_ops)`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_city`);
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_county`);
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_state`);
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_uuid_trgm`);
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_city_trgm`);
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_county_trgm`);
  await knex.raw(`DROP INDEX IF EXISTS idx_orders_state_trgm`);

  await knex.schema.alterTable('orders', (table) => {
    table.jsonb('jurisdictions').nullable();
  });

  await knex.raw(`
    UPDATE orders SET
      jurisdictions = json_build_object(
        'city',     city,
        'county',   county,
        'state',    state,
        'postcode', postcode
      )::jsonb
  `);

  await knex.schema.alterTable('orders', (table) => {
    table.jsonb('jurisdictions').notNullable().alter();
  });

  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_county ON orders ((jurisdictions->>'county'))`);
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_orders_city   ON orders ((jurisdictions->>'city'))`);

  await knex.schema.alterTable('orders', (table) => {
    table.dropColumn('city');
    table.dropColumn('county');
    table.dropColumn('state');
    table.dropColumn('postcode');
  });
}
