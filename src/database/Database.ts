import knex, { Knex } from 'knex'
import { PassThrough } from 'node:stream';
import { Helper } from '../Helper';
import { Interfaces } from '../Interfaces';



module Database{

    let database : Knex<any, unknown[]>;

    const knex = require('knex');
    const knexfile = require('./knexfile');
    const env = process.env.NODE_ENV || 'development';
    const configOptions = knexfile[env];

    export async function connect(){

        database = knex(configOptions);
        console.log('Database : OK');

        try{
            database.migrate.latest();
        }catch(exception){
            console.log('Error migrando');
        }

    }


    export async function insertUser(data : Interfaces.SignInData){

        try{
            await database('users').insert({name : data.name, email : data.email , password : data.password});
        }catch(exception){
            console.log('Error insertando usuario en la base de datos');
        }
    }

    export async function checkUserCredentials(credentials : Interfaces.UserCredentials){
        
        try{
            let result = await database('users').select().where('email', credentials.email).andWhere('password', credentials.password);
            
            if(result.length == 0)
                return false;
            else
                return true;

        }catch(exception){
            console.log('Error comprobando credenciales');
        }
        
    }

    export async function getUser(email : string) {
        return false;
    }
}

export {Database};

