import {Helper} from "./Helper";					// Aux methods
import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";


module ClientsManager{

    let clientsMap = new Map();

    export function handleClientTokenRequest(socket : WebSocket, request : Interfaces.Request){

        let userCredentials = JSON.parse(request.content);
        let token = "";
    
        if(checkClientCredentials(userCredentials)){				// Check user credentials
            token = Helper.generateToken(10);             			// Create random token for the user
            clientsMap.set(token, userCredentials.userName);    	// Save the token and user
        }
    
        Socket.write(socket, 'tokenCallback', token);
    }
    
    function checkClientCredentials(credentials : Interfaces.UserCredentials) : boolean{
        // TODO comprobar que el usuario existe y la contraseña coincide
    
        return true;
    }

}


export {ClientsManager};