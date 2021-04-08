import {Interfaces} from './Interfaces';


const BCRYPT = require('bcrypt');
const DATABASE = require('./database/Database');


module UsersManager{

    
    export async function insertUser(data : Interfaces.SignInData){

        try{
            await DATABASE.select().table('users').insert({name : data.name, email : data.email , password : BCRYPT.hashSync(data.password , 10)});
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
            let searchResult = await DATABASE.select().table('users').where('email', email).first();

            if(searchResult == undefined)       // User not found
                return null;
            
            return JSON.parse(JSON.stringify(searchResult));

        }catch(exception){
            console.log('Error obteniendo un usuario ' + exception);
        }

        return null;
    }

}

export {UsersManager};