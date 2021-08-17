exports.up = async function(knex) {

	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return knex.schema
        .createTable('shapes', function(table) {
            table.uuid('id', 255).primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
            table.string('kind', 255).notNullable()
            table.float('x', 14, 10).notNullable();     // Position
            table.float('y', 14, 10).notNullable();
            table.float('z', 14, 10).notNullable();
            table.float('sx', 14, 10).notNullable();    // Scale
            table.float('sy', 14, 10).notNullable();
            table.float('sz', 14, 10).notNullable();
            table.float('rx', 14, 10).notNullable();    // Rotation
            table.float('ry', 14, 10).notNullable();
            table.float('rz', 14, 10).notNullable();
            table.uuid('sceneID', 255).notNullable()
        })

}

exports.down = function(knex) {
    return knex.schema.dropTable('shapes')
}