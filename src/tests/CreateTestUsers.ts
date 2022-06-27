import {UsersManager} from "../UsersManager";

module Testing{
    
    export async function createTestUsers(){

        let USERS_TO_CREATE = 100;
        console.log('Se van a insertar ' + USERS_TO_CREATE + ' usuarios');

        for(let i = 0 ; i < USERS_TO_CREATE ; ++i)
            await UsersManager.insertUser({ id : "", name : "user" + i , email : "user" + i , password : "pass"});  
        
        console.log('Terminado');
    }

}

Testing.createTestUsers();