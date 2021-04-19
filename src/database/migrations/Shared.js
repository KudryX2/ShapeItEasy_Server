exports.up = async function(knex) {

	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return knex.schema
        .createTable('shared', function(table) {
            table.uuid('userID', 255).notNullable()
            table.uuid('sceneID', 255).notNullable()
            table.string('permissions', 255).notNullable()
        })

}

exports.down = function(knex) {
    return knex.schema.dropTable('shared')
}