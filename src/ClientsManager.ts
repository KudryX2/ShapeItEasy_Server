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
            
            Socket.write(socket, 'signInCallback', Helper.generateToken(10));   // If everything OK answer with a token
        }

    }

    function checkSignInData(data : Interfaces.SignInData , socket : WebSocket){

        


        return true;
    }

}


export {ClientsManager};