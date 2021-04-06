import knex, { Knex } from 'knex'


module Database{

    let database : Knex<any, unknown[]>;

    export async function connect(){

        database = knex({
            client: 'pg',
            connection: {
                host : '127.0.0.1',
                user : 'postgres',
                password : 'pato',
                database : 'postgres'
            }
        });

        database.migrate.latest();

        console.log('Database : OK');
    }


    export function getUser(email : string){

        return false;

    }

    

}

export {Database};

