import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number', 8).notNullable().alter()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('teachers_class', table => {
    table.dropForeign('classes_id')
    table.foreign('classes_id').references('classes_interval.id')
  })
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
  await knex.schema.alterTable('teachers_class', table => {
    table.dropForeign('classes_id')
    table.foreign('classes_id').references('classes.id')
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number').notNullable().alter()
  })
}
