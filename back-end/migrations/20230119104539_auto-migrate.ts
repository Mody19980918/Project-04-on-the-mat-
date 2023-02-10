import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('studio', table => {
    table.dropColumn('longitude')
    table.dropColumn('latitude')
    table.point('positions').nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('studio', table => {
    table.dropColumn('positions')
    table.point('latitude').nullable()
    table.point('longitude').nullable()
  })
}
