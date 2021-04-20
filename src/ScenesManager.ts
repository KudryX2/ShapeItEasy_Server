import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";
import { ClientsManager } from "./ClientsManager";


const DATABASE = require('./database/Database');


module ScenesManager{

    let connectionsMap : Map<string, Array<string>> = new Map<string, Array<string>>();     // SceneID , List<UserTokens>

    
    export async function handleScenesListRequest(socket : WebSocket, request : Interfaces.Request){

        let user : Interfaces.User | undefined = ClientsManager.getUser(request.token);
        let scenesList : JSON[] = [];

        if(user != undefined){
            
            try {
                scenesList = await DATABASE.select('id','name','description','shareViewID','shareEditID','shareEditIDExpiration','permissions')
                .from('shared')
                .where('userID', '=', user.id)          // Scenes shared with logged user
                .leftJoin('scenes', 'sceneID', 'id');
                
                Socket.write(socket, 'scenesListCallback', JSON.stringify(scenesList));
            }catch(exception){
                console.log('Error obteniendo la lista de escenas ' + exception )
                Socket.write(socket, 'scenesListCallback', 'ERROR');
            }

        }
    }


    export async function handleCreateSceneRequest(socket : WebSocket, request : Interfaces.Request){
        
        try{
            let user : Interfaces.User | undefined = ClientsManager.getUser(request.token);   
            let scene : Interfaces.Scene = JSON.parse(request.content);

            if(user != undefined){    
                let insertedSceneID : string = (await DATABASE.select().table('scenes').insert({name : scene.name, description : scene.description}).returning('id'))[0];   // Insert scene and return generated id
                await DATABASE.select().table('shared').insert({userID : user.id, sceneID : insertedSceneID, permissions : 'owner'});                                       // Insert shared with user data
                Socket.write(socket, 'createSceneCallback', 'OK');
            }
            
        }catch(exception){
            console.log('Error insertando escena ' + exception);
            Socket.write(socket, 'createSceneCallback', 'ERROR');
        }

    }


    export async function handleEditSceneRequest(socket : WebSocket, request : Interfaces.Request){

        try{
            let scene : Interfaces.Scene = JSON.parse(request.content);

            await DATABASE.update('name', scene.name).update('description', scene.description).table('scenes').where('id', scene.id);
            Socket.write(socket, 'editSceneCallback', 'OK');
        
        }catch(exception){
            console.log('Error modificando una escena ' + exception);
            Socket.write(socket, 'editSceneCallback', 'ERROR');
        }

    }


    export async function handleDeleteSceneRequest(socket : WebSocket, request : Interfaces.Request){

        try{
            await DATABASE.table('scenes').where('id', request.content).del();          // Delete from scenes table
            await DATABASE.table('shared').where('sceneID', request.content).del();     // Delete from shared table
            Socket.write(socket, 'deleteSceneCallback', 'OK');
        }catch(exception){
            console.log('Error eliminando una escena')
            Socket.write(socket, 'deleteSceneCallback', 'ERROR');
        }

    }


    export async function handleConnectRequest(socket : WebSocket, request : Interfaces.Request){        
        let sceneID : string = request.content;
        let clientToken : string = request.token;
                
        let scene = await DATABASE.select().column('id','name','owner').table("scenes").where('id', sceneID).first();
        
        if(scene != undefined){     // Check if scene exists
            
            let sceneConnections : Array<string> | undefined = connectionsMap.get(sceneID);    // Users connected to the scene

            if(sceneConnections != undefined){          // Existing connections 
                sceneConnections.push(clientToken);                         // add new connection
                connectionsMap.set(sceneID, sceneConnections);              // update the connections map

            }else{                                      // No connections
                let connectionsList : Array<string> = new Array<string>();  // create new connections list
                connectionsList.push(clientToken);                          // add new connection
                connectionsMap.set(sceneID, connectionsList);               // add entry to the map
            
            }

            Socket.write(socket, 'connectCallback', 'OK');

        }else
            Socket.write(socket, 'connectCallback', 'La escena no existe');   
    
    }


    export async function handleDisconnectRequest(socket : WebSocket, request : Interfaces.Request){

        let sceneID : string = request.content;
        let clientToken : string = request.token;
        let connectionsList : Array<string> | undefined = connectionsMap.get(sceneID);
        
        if(connectionsList != undefined){                           // Check if scene has connections
            delete connectionsList[connectionsList.indexOf(clientToken)];   // Delete connection from the list

            if(connectionsList.length == 0)                             // IF connections list empty 
                connectionsMap.delete(sceneID);                             // Delete map entry 
            else                                                        // ELSE
                connectionsMap.set(sceneID, connectionsList);               // Update map entry 

            Socket.write(socket, 'disconnectCallback', 'OK');

        }else
            Socket.write(socket, 'disconnectCallback', 'La escena no existe');

    }

/*
    function printConnectionsMap(){             // Testing
        console.log('mapa de conexiónes');
        connectionsMap.forEach((value : Array<string> , key : string ) => 
            value.forEach((value : string) => console.log(value))
        );
    }
*/

    export function deleteConnection(token : string){   // Delete a connection of a specific user
        
        let stopLooping : boolean = false;

        for(let [sceneID, connectionsList] of connectionsMap){  // For each scene

            for( let connection of connectionsList)             // For each scene connection (token)
                if(connection == token){                            // Token Found 
                    delete connectionsList[connectionsList.indexOf(connection)];    // Delete token from the list
                    connectionsMap.set(sceneID, connectionsList);                   // Update connectionsMap
                    stopLooping = true;
                    break;
                }
                    
            if(stopLooping)
                break;
        }

    }

}

export {ScenesManager};