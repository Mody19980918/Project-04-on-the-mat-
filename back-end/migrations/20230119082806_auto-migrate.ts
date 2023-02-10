import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number', 8).notNullable().alter()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })

  if (!(await knex.schema.hasTable('chat_record'))) {
    await knex.schema.createTable('chat_record', table => {
      table.increments('id')
      table.integer('sender_id').unsigned().notNullable().references('users.id')
      table.integer('receiver_id').unsigned().notNullable().references('users.id')
      table.string('messages', 1000).notNullable()
      table.timestamp('sent_time').notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('chat_record')
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('studio', table => {
    table.integer('phone_number').notNullable().alter()
  })
}
