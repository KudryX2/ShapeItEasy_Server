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

    export async function checkUserCredentials(credentials : Interfaces.UserCredentials) : Promise<boolean>{

        try{  
            let user : Interfaces.DatabaseUser | null = await getUser(credentials.email);

            if(user != null)                    // If user found
                return await BCRYPT.compare(credentials.password , user.password);  // If everything OK return compare result

        }catch(exception){
            console.log('Error comprobando las credenciales' + exception);
        }
        
        return false;                           // Something failed or user not found -> return false
    }

    export async function getUser(email : string) : Promise<Interfaces.DatabaseUser | null>{

        try{
            let searchResult = await database('users').select().where('email', email).first();

            if(searchResult == undefined)       // User not found
                return null;
            
            return JSON.parse(JSON.stringify(searchResult));

        }catch(exception){
            console.log('Error obteniendo un usuario ' + exception);
        }

        return null;
    }
}

export {Database};

