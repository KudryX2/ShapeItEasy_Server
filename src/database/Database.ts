import knex, { Knex } from 'knex'
import { PassThrough } from 'node:stream';
import { Helper } from '../Helper';
import { Interfaces } from '../Interfaces';
import { Socket } from '../Socket';

const BCRYPT = require('bcrypt');


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
            await database('users').insert({name : data.name, email : data.email , password : BCRYPT.hashSync(data.password , 10)});
        }catch(exception){
            console.log('Error insertando usuario en la base de datos');
        }
    }

    export async function checkUserCredentials(credentials : Interfaces.UserCredentials){

        try{  
            let result = await database('users').select().where('email', credentials.email).first();
            
            if(result == null)         // User with the given email not found
                return false;
            
            let user : Interfaces.DatabaseUser = JSON.parse(JSON.stringify(result));
            
            try{
                return await BCRYPT.compare(credentials.password , user.password);  // If everything OK return compare result
            }catch(exception){
                console.log('Error comprobando la contraseña del usuario ' + exception);
            }
            
        }catch(exception){
            console.log('Error obteniendo el usuario ' + exception);
        }
        
        return false;                   // Something failed -> return false
        
    }

    export async function getUser(email : string) {
        return false;
    }
}

export {Database};

