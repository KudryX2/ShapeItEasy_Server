import { Database } from "./database/Database";
import {Helper} from "./Helper";					// Aux methods
import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";


module ClientsManager{

    let clientsMap = new Map();

    export function handleLogInRequest(socket : WebSocket, request : Interfaces.Request){
        
        console.log('Log In Request');

        let userCredentials = JSON.parse(request.content);
        let token = "";
    
        if(checkClientCredentials(userCredentials)){				// Check user credentials
            
            token = Helper.generateToken(10);             			// Create random token for the user
            clientsMap.set(token, userCredentials.userName);    	// Save the token and user
        }
    
        Socket.write(socket, 'logInCallback', token);
    }
    
    function checkClientCredentials(credentials : Interfaces.UserCredentials) : boolean{
        // TODO comprobar que el usuario existe y la contraseña coincide
    
        return true;
    }


    export function handleSignInRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Sign In Request');

        if(checkSignInData(JSON.parse(request.content), socket)){       // Check the data
            // TODO añadir nuevo usuario a la base de datos
        
            Socket.write(socket, 'signInCallback', '{ "result" : "success", "message":"' + Helper.generateToken(10) + '" }');   // If everything OK answer with a token
        }

    }

    function checkSignInData(data : Interfaces.SignInData , socket : WebSocket){

        if(!Helper.validate(data.userName, Helper.DataKind.text)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Nombre no es valido" }' );
            return false;
        } 

        if(!Helper.validate(data.userEmail, Helper.DataKind.email)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Email no es válido" }' );
            return false;
        }

        if(!Helper.validate(data.userPassword, Helper.DataKind.text)){
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Contraseña no es valida" }' );
            return false;
        }
    

        if(Database.getUser(data.userEmail)){                   
            Socket.write(socket, 'signInCallback', '{ "result" : "error" , "message" : "Usuario ya existe" }' );
            return false;
        }


        return true;
    }

}


export {ClientsManager};