import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('studio', table => {
    table.dropColumn('longitude')
    table.dropColumn('latitude')
    table.integer('phone_number', 8).notNullable().alter()
    table.point('positions').nullable()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('studio', table => {
    table.dropColumn('positions')
    table.integer('phone_number').notNullable().alter()
    table.point('latitude').nullable()
    table.point('longitude').nullable()
  })
}
