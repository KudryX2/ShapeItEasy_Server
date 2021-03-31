import {Scene} from "./Scene";
import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";


const ENCODER = new TextEncoder();


module ScenesManager{

    let scenesList = new Array<Scene>();

    export function handleScenesListRequest(socket : WebSocket, request : Interfaces.Request){

        let list : JSON[] = [];
        scenesList.forEach(scene => list.push(scene.getJSON()));

        Socket.write(socket, 'scenesListCallback', JSON.stringify(list));
    }

    export function handleCreateSceneRequest(socket : WebSocket, request : Interfaces.Request){
        
        console.log('Petición de crear una escena ' + request.content);
        scenesList.push(new Scene(request.content));
        Socket.write(socket, 'createSceneCallback', 'OK');
    }

    export function handleEditSceneRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Petición de editar una escena ' + request.content);

        // TODO modificar la escena

        Socket.write(socket, 'editSceneCallback', 'OK');
    }

    export function handleDeleteSceneRequest(socket : WebSocket, request : Interfaces.Request){

        console.log('Petición de eliminar una escena ' + request.content);

        // TODO eliminar la escena

        Socket.write(socket, 'deleteSceneCallback', 'OK');
    }

   


}

export {ScenesManager};