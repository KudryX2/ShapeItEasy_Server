import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";
import { ClientsManager } from "./ClientsManager";
import { Session } from "node:inspector";
import { UsersManager } from "./UsersManager";
import { Helper } from "./Helper";
import { networkInterfaces } from "node:os";
import { Scene } from "./Scene";
import { Console } from "node:console";


const DATABASE = require('./database/Database');


module ScenesManager{

    let activeScenes : Map<string, Scene> = new Map<string, Scene>();                       // SceneID , Scene

    
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

        let sceneID : string = request.content;
        let user : Interfaces.User | undefined = ClientsManager.getUser(request.token);

        if(user == undefined){          // Check the user
            Socket.write(socket, 'addSceneCallback', 'La sesión de usuario ha expirado');
            return;
        }
        let shared : Interfaces.Shared = await DATABASE.table('shared').where('userID', user.id).where('sceneID', sceneID).first();

        if(shared.permissions == 'owner'){                      // Request from owner -> delete scene 
            await DATABASE.table('scenes').where('id', request.content).del();          // Delete from scenes table
            await DATABASE.table('shared').where('sceneID', request.content).del();     // Delete from shared table
            
        }else{                                                  // Request from viewer/editor -> stop sharing scene
            await DATABASE.table('shared').where('sceneID', request.content).andWhere('userID', user.id).del();     // Delete from shared table for the user
        }        
    
        Socket.write(socket, 'deleteSceneCallback', 'OK');
    }


    export async function handleAddSceneRequest(socket : WebSocket, request : Interfaces.Request){

        let sceneShareID : string = request.content;

        // Check the user
        let user : Interfaces.User | undefined = ClientsManager.getUser(request.token);     
        if(user == undefined){                                               
            Socket.write(socket, 'addSceneCallback', 'La sesión de usuario ha expirado');
            return;
        }

        // Check Scene Share ID        
        if(!Helper.validate(sceneShareID, Helper.DataKind.shareID)){
            Socket.write(socket, 'addSceneCallback', 'Share ID proporcionado es incorrecto');
            return;
        }
        
        let scene : Interfaces.Scene = await DATABASE.table('scenes').where('shareEditID', sceneShareID).orWhere('shareViewID', sceneShareID).first();     
        if(scene == undefined){                     // Given shareID does not exist
            Socket.write(socket, 'addSceneCallback', 'Share ID proporcionado no existe');
            return;
        }

        // Check if the scene is already added for the user
        let shared = await DATABASE.table('shared').where('userID', user.id).where('sceneID', scene.id).first();
        if(shared != undefined){                    // Scene already added
            Socket.write(socket, 'addSceneCallback', 'Esta escena ya ha sido añadida');
            return;
        }

        let userPermissions : string = 'view';      // Give view permissions by default
        if(scene.shareEditID == sceneShareID)       // If ShareEditID equals to given shareID -> edit permissions
            userPermissions = 'edit';

        // Add scene
        await DATABASE.select().table('shared').insert({userID : user.id , sceneID : scene.id, permissions : userPermissions});               
        
        Socket.write(socket, 'addSceneCallback', 'OK');     
    }


    export async function handleConnectRequest(socket : WebSocket, request : Interfaces.Request){        
        let sceneID : string = request.content;
        let clientToken : string = request.token;
                
        let scene : Interfaces.Scene | undefined = await DATABASE.select().column('id','name').table("scenes").where('id', sceneID).first();
        
        if(scene != undefined){     // Check if scene exists

            let shapesInfo : string | undefined;
            
            if(activeScenes.has(sceneID)){      // Scene already active -> add new connection
                activeScenes.get(sceneID)?.addConnection(clientToken, socket);
                shapesInfo = activeScenes.get(sceneID)?.getShapesInfo();

            }else{                              // Scene wasn´t active -> add active scene and connection
                let newActiveScene = new Scene(sceneID, scene.name);
                await newActiveScene.loadShapes();
                shapesInfo = newActiveScene.getShapesInfo();
                newActiveScene.addConnection(clientToken, socket);
                activeScenes.set(sceneID, newActiveScene);
            }

            Socket.write(socket, 'connectCallback', '{ "status" : "OK" , "info" : "' + shapesInfo?.toString() + '" }');

        }else
            Socket.write(socket, 'connectCallback', '{ "status" : "Error" }');   
    
    }


    export async function handleDisconnectRequest(socket : WebSocket, request : Interfaces.Request){

        let sceneID : string = request.content;
        let clientToken : string = request.token;        

        try{
            activeScenes.get(sceneID)?.removeConnection(clientToken);       // Remove connection
    
            if(activeScenes.get(sceneID)?.getConnectionsAmmount() == 0)     // If scene has no clients -> remove from the list
                activeScenes.delete(sceneID);
                
            Socket.write(socket, 'disconnectCallback', 'OK');
        
        }catch(exception){
            console.log('Error desconectandose de la escena');
            Socket.write(socket, 'disconnectCallback', 'ERROR');
        }

    }


    export async function handleAddShapeRequest(socket : WebSocket, request : Interfaces.Request){

        try{
            let addShapeRequest : Interfaces.AddShapeRequest  = JSON.parse(request.content);    
            activeScenes.get(addShapeRequest.sceneID)?.addShape(addShapeRequest);
        
            Socket.write(socket, 'addShapeCallback', 'OK');

        }catch(exception){
            console.log('Error añadiendo una forma a la escena');
            Socket.write(socket, 'addShapeCallback', 'ERROR');
        }

    }


    export async function handleUpdateShapeRequest(socket : WebSocket, request : Interfaces.Request){
        console.log(request.content);
        // TODO actualizar base datos
        // TODO broadcast message de la actualización
    }


    // Used when user tries to reconnect but didnt close the session properly -> remove old session
    export async function deleteConnection(clientToken : string ){

        for( let scene of activeScenes.values())        // Loop activeScenes 
            if(scene.removeConnection(clientToken)){    // if scene contains connection -> remove connection
                if(scene.getConnectionsAmmount() == 0)  // If scene has no clients -> remove from the list 
                    activeScenes.delete(scene.id);
                break;                                  // success -> stop looping 
            }
    }


    function printAllConnections(){
        console.log('Conexiones');
        activeScenes.forEach((scene : Scene , key : string ) => scene.printConnections());
    }

}

export {ScenesManager};