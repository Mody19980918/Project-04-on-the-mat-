import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number', 8).notNullable().alter()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('class_reviews', table => {
    table.dropColumn('create_date')
  })
  await knex.schema.alterTable('user_classes_lesson', table => {
    table.string('attendance', 50).nullable()
  })
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
  await knex.schema.alterTable('user_classes_lesson', table => {
    table.dropColumn('attendance')
  })
  await knex.schema.alterTable('class_reviews', table => {
    table.date('create_date').notNullable()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number').notNullable().alter()
  })
}
