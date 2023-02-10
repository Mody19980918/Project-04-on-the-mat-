import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chat_record', table => {
    table.setNullable('messages')
    table.setNullable('sent_time')
    table.boolean('receive_status').nullable()
    table.boolean('read_status').nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chat_record', table => {
    table.dropColumn('read_status')
    table.dropColumn('receive_status')
    table.dropNullable('sent_time')
    table.dropNullable('messages')
  })
}
