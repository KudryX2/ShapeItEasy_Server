import {Helper} from "./Helper";					// Aux methods
import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";

import {UsersManager} from './UsersManager';


module ClientsManager{

    let clientsMap = new Map();


    export async function handleLogInRequest(socket : WebSocket, request : Interfaces.Request){
        
        console.log('Log In Request');

        let userCredentials : Interfaces.UserCredentials = JSON.parse(request.content);
        let token = "";
    
        if(checkLogInData(userCredentials, socket)){                // Validate data

            let checkUserCredentialsResult : boolean | Interfaces.User = await UsersManager.checkUserCredentials(userCredentials);

            if(checkUserCredentialsResult != false){	            // Check user credentials

                token = Helper.generateToken(10);             			// Create random token for the user
                clientsMap.set(token, checkUserCredentialsResult);    	// Save the token and user
            }
        }

        Socket.write(socket, 'logInCallback', token);
    }
    

    export async function handleSignInRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Sign In Request') ;
        
        let signInData : Interfaces.SignInData = JSON.parse(request.content);

        if(await checkSignInData(signInData, socket)){          // Check the data
            let insertedUser : Interfaces.User | null = await UsersManager.insertUser(signInData);      // If everything OK insert user 

            if(insertedUser != null){                           // If user successfuly inserted in db
                let token = Helper.generateToken(10);
                clientsMap.set(token, insertedUser);    	    // Save the token and user
                Socket.write(socket, 'signInCallback', '{ "result" : "success", "message":"' + token + '" }');   // If everything OK answer with a token
            }
        }

    }


    export function handleLogOutRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Log out Request');

        clientsMap.delete(request.token);           // Remove the caller from clients map

        // TODO comprobar si el usuario estaba conectado a una escena y si lo estaba eliminarlo del mapa de conexiones

        Socket.write(socket, 'logOutCallback', 'OK');
    }


    /*
        Data validation methods
    */
    function checkLogInData(data : Interfaces.UserCredentials, socket : WebSocket){

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

    async function checkSignInData(data : Interfaces.SignInData , socket : WebSocket){

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
    export function getEmail(token : string){
        return clientsMap.get(token).email;
    }

}


export {ClientsManager};