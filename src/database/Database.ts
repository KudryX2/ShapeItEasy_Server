import knex, { Knex } from 'knex'



module Database{

    let database : Knex<any, unknown[]>;

    const knex = require('knex');
    const knexfile = require('./knexfile');
    const env = process.env.NODE_ENV || 'development';
    const configOptions = knexfile[env];

    export async function connect(){

        database = knex(configOptions);

        database.migrate.latest();

        console.log('Database : OK');
    }


    export async function getUser(email : string) {
        return false;
    }
}

export {Database};

