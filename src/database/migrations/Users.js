exports.up = async function(knex) {

    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return knex.schema
        .createTable('users', function(table) {
            table.uuid('id', 255).primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('name', 255).notNullable()
            table.string('email', 255).unique().notNullable()
            table.string('password', 255).notNullable()
        })

}

exports.down = function(knex) {
    return knex.schema.dropTable('users')
}

