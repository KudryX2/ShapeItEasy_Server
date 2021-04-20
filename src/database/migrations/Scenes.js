exports.up = async function(knex) {

	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return knex.schema
        .createTable('scenes', function(table) {
            table.uuid('id', 255).primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('name', 255).notNullable()
            table.string('description', 255)
            table.uuid('shareViewID', 255).notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
            table.uuid('shareEditID', 255).notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
            table.date('shareEditIDExpiration')
        })

}

exports.down = function(knex) {
    return knex.schema.dropTable('scenes')
}