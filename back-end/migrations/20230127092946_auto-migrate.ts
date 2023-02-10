import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number', 8).notNullable().alter()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('classes', table => {
    table.dropColumn('state')
  })
  await knex.schema.alterTable('classes_interval', table => {
    table.string('state', 50).nullable()
  })
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
  await knex.schema.alterTable('classes_interval', table => {
    table.dropColumn('state')
  })
  await knex.schema.alterTable('classes', table => {
    table.string('state', 50).nullable()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number').notNullable().alter()
  })
}
