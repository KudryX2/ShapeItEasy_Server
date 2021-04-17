import {Helper} from "./Helper";					// Aux methods
import {Interfaces} from "./Interfaces";
import { ScenesManager } from "./ScenesManager";
import {Socket} from "./Socket";

import {UsersManager} from './UsersManager';


module ClientsManager{

    let usersMap : Map<string, Interfaces.User> = new Map<string, Interfaces.User>();     // UserToken , User


    export async function handleLogInRequest(socket : WebSocket, request : Interfaces.Request){
        
        let userCredentials : Interfaces.User = JSON.parse(request.content);
        let token = "";
    
        if(checkLogInData(userCredentials, socket)){                // Validate data

            let checkUserCredentialsResult : boolean | Interfaces.User = await UsersManager.checkUserCredentials(userCredentials);

            if( typeof checkUserCredentialsResult !== 'boolean'){   // Check user credentials

                for(let [token, user] of usersMap){                 // Check if user already connected from another client

                    if(user.email == userCredentials.email){           // If Connected
                        console.log('Se va a eliminar la sesión antigua');
                        usersMap.delete(token);                             // Delete clientsMap entry
                        ScenesManager.deleteConnection(token);              // Delete connectionsMap entry (Scenes)
                        break;
                    }
                }

                token = Helper.generateToken(10);             			// Create random token for the user
                usersMap.set(token, checkUserCredentialsResult);    	// Save the token and user
            }
        }

        Socket.write(socket, 'logInCallback', token);
    }


    export async function handleSignInRequest(socket : WebSocket, request : Interfaces.Request){
        
        let credentials : Interfaces.User = JSON.parse(request.content);

        if(await checkSignInData(credentials, socket)){          // Check the data
            let insertedUser : Interfaces.User | null = await UsersManager.insertUser(credentials);      // If everything OK insert user 

            if(insertedUser != null){                           // If user successfuly inserted in db
                let token = Helper.generateToken(10);
                usersMap.set(token, insertedUser);    	        // Save the token and user
                Socket.write(socket, 'signInCallback', '{ "result" : "success", "message":"' + token + '" }');   // If everything OK answer with a token
            }
        }

    }


    export function handleLogOutRequest(socket : WebSocket, request : Interfaces.Request){
        usersMap.delete(request.token);           // Remove the caller from clients map
        Socket.write(socket, 'logOutCallback', 'OK');
    }


    /*
        Data validation methods
    */
    function checkLogInData(data : Interfaces.User, socket : WebSocket){

        if(!Helper.validate(data.email, Helper.DataKind.email)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Email no es valido" }' );
            return false;
        }

        if(!Helper.validate(data.password, Helper.DataKind.text)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Contraseña no es válida" }' );
            return false;
        }

        return true;

    }

    async function checkSignInData(data : Interfaces.User , socket : WebSocket){

        if(!Helper.validate(data.name, Helper.DataKind.text)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Nombre no es valido" }' );
            return false;
        } 

        if(!Helper.validate(data.email, Helper.DataKind.email)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Email no es válido" }' );
            return false;
        }

        if(!Helper.validate(data.password, Helper.DataKind.text)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Contraseña no es valida" }' );
            return false;
        }
    

        if(await UsersManager.getUser(data.email) != null){                   
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Usuario ya existe" }' );
            return false;
        }

        return true;
    }

    /*
        Auxiliar functions
    */
    export function getUser(token : string) : Interfaces.User | undefined{
        return usersMap.get(token);  
    }

}


export {ClientsManager};