import { networkInterfaces } from "node:os";
import { Interface } from "node:readline";
import { Database } from "./database/Database";
import {Helper} from "./Helper";					// Aux methods
import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";


module ClientsManager{

    let clientsMap = new Map();


    export async function handleLogInRequest(socket : WebSocket, request : Interfaces.Request){
        
        console.log('Log In Request');

        let userCredentials = JSON.parse(request.content);
        let token = "";
    
        if(checkLogInData(userCredentials, socket))
            if(await Database.checkUserCredentials(userCredentials)){	// Check user credentials
                
                token = Helper.generateToken(10);             			// Create random token for the user
                clientsMap.set(token, userCredentials.userName);    	// Save the token and user
            }

        Socket.write(socket, 'logInCallback', token);
    }
    

    export async function handleSignInRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Sign In Request') ;
        
        let signInData : Interfaces.SignInData = JSON.parse(request.content);

        if(await checkSignInData(signInData, socket)){        // Check the data
            await Database.insertUser(signInData);      // If everything OK insert user 
            Socket.write(socket, 'signInCallback', '{ "result" : "success", "message":"' + Helper.generateToken(10) + '" }');   // If everything OK answer with a token
        }

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
    

        if(await Database.getUser(data.email)){                   
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Usuario ya existe" }' );
            return false;
        }

        return true;
    }

}


export {ClientsManager};