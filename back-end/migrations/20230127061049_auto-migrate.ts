import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.boolean('finished_quiz').nullable()
  })
  await knex.schema.alterTable('studio', table => {
    table.dropColumn('positions')
    table.integer('phone_number', 8).notNullable().alter()
    table.point('latitude').nullable()
    table.point('longitude').nullable()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })

  if (!(await knex.schema.hasTable('user_registration_quiz'))) {
    await knex.schema.createTable('user_registration_quiz', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.string('yoga_type', 25).nullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_registration_quiz')
  await knex.schema.alterTable('payment_record', table => {
    table.decimal('amount').notNullable().alter()
  })
  await knex.schema.alterTable('teachers', table => {
    table.decimal('rating').nullable().alter()
  })
  await knex.schema.alterTable('studio', table => {
    table.dropColumn('longitude')
    table.dropColumn('latitude')
    table.integer('phone_number').notNullable().alter()
    table.point('positions').nullable()
  })
  await knex.schema.alterTable('users', table => {
    table.dropColumn('finished_quiz')
  })
}
