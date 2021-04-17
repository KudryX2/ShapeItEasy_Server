import {Interfaces} from './Interfaces';


const BCRYPT = require('bcrypt');
const DATABASE = require('./database/Database');


module UsersManager{

    
    export async function insertUser(data : Interfaces.User) : Promise<Interfaces.User | null>{

        try{
            await DATABASE.select().table('users').insert({name : data.name, email : data.email , password : BCRYPT.hashSync(data.password , 10)});
            return getUser(data.email);
        }catch(exception){
            console.log('Error insertando usuario en la base de datos');
            return null;
        }
    }


    export async function checkUserCredentials(credentials : Interfaces.User) : Promise <boolean | Interfaces.User>{

        try{  
            let user : Interfaces.User | null = await getUser(credentials.email);

            if(user != null)                                                // If user found
                if( await BCRYPT.compare(credentials.password , user.password ))    // If everything OK return user
                    return user;
                else                                                                // ELSE return false
                    return false;

        }catch(exception){
            console.log('Error comprobando las credenciales' + exception);
        }
        
        return false;                           // Something failed or user not found -> return false
    }


    export async function getUser(email : string) : Promise<Interfaces.User | null>{

        try{
            return await DATABASE.select().table('users').where('email', email).first();
        }catch(exception){
            console.log('Error obteniendo un usuario ' + exception);
        }

        return null;
    }

}

export {UsersManager};