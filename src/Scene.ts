import {Helper} from "./Helper";
import {Shape} from "./Shape";
import {Interfaces} from "./Interfaces";
import {Socket} from "./Socket";


const DATABASE = require('./database/Database');


interface SceneInterface{
    name : string
}

class Scene{

    id : string;
    name : string;
    shapes : Array<Shape>;
    connections : Map<string, WebSocket>;
    
    
    constructor(id : string, name : string){
        this.id = id;
        this.name = name;

        this.connections = new Map<string, WebSocket>();
        this.shapes = new Array<Shape>();
    }


    broadcastMessage(kind : string, content : string){

        for(let [token, webSocket] of this.connections)
            Socket.write(webSocket, kind, content);     
    }

    /*
        Connection methods
    */
    addConnection(clientToken : string, socket : WebSocket) : void{
        this.connections.set(clientToken, socket);
    }

    removeConnection(clientToken : string) : boolean{

        if(this.connections.has(clientToken)){         // If contains connection -> remove connection 
            this.connections.delete(clientToken);
            return true;
        }

        return false;                                       // Return false if no coincidence 
    }

    getConnectionsAmmount() : number {
        return this.connections.size;
    }

    printConnections() : void {
        console.log("Connections : " + this.name + " ");
    
        for( let [token, webSocket] of this.connections)
            console.log(token);
    }

    /*
        Shapes Methods
    */
    async addShape(addShapeRequest : Interfaces.AddShapeRequest){
    
        try{

            let insertedShapeID : string = (await DATABASE.select().table('shapes').insert({kind : addShapeRequest.shape, x : addShapeRequest.x, y : addShapeRequest.y, z : addShapeRequest.z, sx : 1, sy : 1, sz : 1, rx : 0, ry : 0, rz : 0, sceneID : addShapeRequest.sceneID }).returning('id'))[0];

            let addedShapeInfo : JSON = <JSON><unknown>{
                "action" : "added",
                "id" : insertedShapeID,
                "shape" : addShapeRequest.shape,
                "x" : addShapeRequest.x,
                "y" : addShapeRequest.y,
                "z" : addShapeRequest.z,
                
                "sx" : 1,
                "sy" : 1,
                "sz" : 1,

                "rx" : 0,
                "ry" : 0,
                "rz" : 0
            };

            let newShape : Shape = new Shape(insertedShapeID, addShapeRequest.shape, addShapeRequest.x, addShapeRequest.y, addShapeRequest.z, 1, 1, 1, 0, 0, 0);
            this.shapes.push(newShape);

            console.log(JSON.stringify(addedShapeInfo));
            
            this.broadcastMessage('sceneUpdate' , JSON.stringify(addedShapeInfo));

        }catch(exception){
            console.log('Error añadiendo una figura a la escena ' + exception);
        }

    }

    async loadShapes(){
        let sceneShapes : Interfaces.Shape[] | undefined = await DATABASE.select().table("shapes").where('sceneID', this.id);

        if(sceneShapes != undefined)
            for(let i = 0 ; i < sceneShapes.length ; ++i)
                this.shapes.push(new Shape(sceneShapes[i].id, sceneShapes[i].kind, sceneShapes[i].x, sceneShapes[i].y, sceneShapes[i].z, sceneShapes[i].sx, sceneShapes[i].sy, sceneShapes[i].sz, sceneShapes[i].rx, sceneShapes[i].ry, sceneShapes[i].rz));

    }

    async updateShape(updateShapeRequest : Interfaces.UpdateShapeRequest){

        try{
            // Update DB
            await DATABASE.select().table('shapes').update({x  : updateShapeRequest.position.x, y  : updateShapeRequest.position.y, z : updateShapeRequest.position.z, 
                                                            sx : updateShapeRequest.scale.x,    sy : updateShapeRequest.scale.y,    sz : updateShapeRequest.scale.z,
                                                            rx : updateShapeRequest.rotation.x, ry : updateShapeRequest.rotation.y, rz : updateShapeRequest.rotation.z,
                                                        }).where('id', updateShapeRequest.shapeID);

            // Update array                                
            for(let i = 0 ; i < this.shapes.length ; ++i)
                if(this.shapes[i].id == updateShapeRequest.shapeID){
                    this.shapes[i].update(updateShapeRequest);
                    break;
                }

            // Broadcast message with updated info
            let updatedShape : JSON = <JSON><unknown>{
                "action" : "updated",
                "id" : updateShapeRequest.shapeID,

                "x" : updateShapeRequest.position.x,
                "y" : updateShapeRequest.position.y,
                "z" : updateShapeRequest.position.z,
                
                "sx" : updateShapeRequest.scale.x,
                "sy" : updateShapeRequest.scale.y,
                "sz" : updateShapeRequest.scale.z,

                "rx" : updateShapeRequest.rotation.x,
                "ry" : updateShapeRequest.rotation.y,
                "rz" : updateShapeRequest.rotation.z
            };

            this.broadcastMessage('sceneUpdate',  JSON.stringify(updatedShape));

        }catch(exception){
            console.log('Error actualizando una figura en la base de datos ' + exception);
        }

    }

    getShapesInfo() : string {
        let infoArray : JSON[] = [];
        this.shapes.forEach((shape : Shape) => infoArray.push(shape.getJSON()));
        return JSON.stringify(infoArray).split('"').join('\'');
    }

    printShapesList() : void {
        console.log("Shapes : " + this.name + " ");
        this.shapes.forEach((shape : Shape) => console.log(shape.kind + ' ' + shape.x + ' ' + shape.y + ' ' + shape.z));
    }
}

export {Scene};