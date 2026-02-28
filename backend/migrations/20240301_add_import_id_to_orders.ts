import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('orders');
    if (!hasTable) return;
    const hasColumn = await knex.schema.hasColumn('orders', 'import_id');
    if (!hasColumn) {
        await knex.schema.alterTable('orders', (table) => {
            table.uuid('import_id').nullable();
        });

        // Add index for faster statistical queries
        await knex.raw(`
      CREATE INDEX IF NOT EXISTS idx_orders_import_id ON orders (import_id);
    `);
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasColumn = await knex.schema.hasColumn('orders', 'import_id');
    if (hasColumn) {
        await knex.schema.alterTable('orders', (table) => {
            table.dropColumn('import_id');
        });
    }
}
