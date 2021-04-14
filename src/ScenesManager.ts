import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";
import { ClientsManager } from "./ClientsManager";


const DATABASE = require('./database/Database');


module ScenesManager{


    export async function handleScenesListRequest(socket : WebSocket, request : Interfaces.Request){

        let list : JSON[] = [];

        try {
            list  = await DATABASE.select().column('id','name').table("scenes").where('owner', ClientsManager.getEmail(request.token)).orderBy('name', 'asc');
            Socket.write(socket, 'scenesListCallback', JSON.stringify(list));
        }catch(exception){
            console.log('Error obteniendo la lista de escenas ' + exception )
            Socket.write(socket, 'scenesListCallback', 'ERROR');
        }

    }


    export async function handleCreateSceneRequest(socket : WebSocket, request : Interfaces.Request){
        
        try{
            let sceneOwner = ClientsManager.getEmail(request.token);

            await DATABASE.select().table('scenes').insert({owner : sceneOwner , name : request.content});
            Socket.write(socket, 'createSceneCallback', 'OK');
        
        }catch(exception){
            console.log('Error insertando escena ' + exception);
            Socket.write(socket, 'createSceneCallback', 'ERROR');
        }

    }


    export async function handleEditSceneRequest(socket : WebSocket, request : Interfaces.Request){

        try{
            let updateSceneRequest : Interfaces.UpdateSceneRequest = JSON.parse(request.content); 
        
            await DATABASE.update('name', updateSceneRequest.newName).table('scenes').where('id', updateSceneRequest.id);
            Socket.write(socket, 'editSceneCallback', 'OK');
        
        }catch(exception){
            console.log('Error modificando una escena ' + exception);
            Socket.write(socket, 'editSceneCallback', 'ERROR');
        }

    }


    export async function handleDeleteSceneRequest(socket : WebSocket, request : Interfaces.Request){

        try{
            await DATABASE.table('scenes').where('id', request.content).del();
            Socket.write(socket, 'deleteSceneCallback', 'OK');
        }catch(exception){
            console.log('Error eliminando una escena')
            Socket.write(socket, 'deleteSceneCallback', 'ERROR');
        }

    }


    export async function handleConnectRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Request ' + request.content + ' by ' + ClientsManager.getEmail(request.token));

        // TODO comprobar is el usuario con el token de la petición tiene permiso para conectarse a la escena que ha solicitado

        Socket.write(socket, 'connectCallback', 'OK');
    }


    export async function handleDisconnectRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Disconnect Request by ' + ClientsManager.getEmail(request.token));


        Socket.write(socket, 'disconnectCallback', 'OK');
    }

}

export {ScenesManager};