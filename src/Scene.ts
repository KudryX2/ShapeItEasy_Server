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

            let newShape : Shape = new Shape(addShapeRequest.shape, addShapeRequest.x, addShapeRequest.y, addShapeRequest.z);
            this.shapes.push(newShape);
            
            await DATABASE.select().table('shapes').insert({kind : addShapeRequest.shape, x : addShapeRequest.x, y : addShapeRequest.y, z : addShapeRequest.z, sizeX : 1, sizeY : 1, sizeZ : 1, sceneID : addShapeRequest.sceneID });
    
            let addedShapeInfo : JSON = <JSON><unknown>{
                "action" : "added",
                "shape" : addShapeRequest.shape,
                "x" : addShapeRequest.x,
                "y" : addShapeRequest.y,
                "z" : addShapeRequest.z
            };
    
            this.broadcastMessage('sceneUpdate' , JSON.stringify(addedShapeInfo));

        }catch(exception){
            console.log('Error añadiendo una figura a la escena ' + exception);
        }

    }

    printShapesList() : void {
        console.log("Shapes : " + this.name + " ");
        this.shapes.forEach((shape : Shape) => console.log(shape.name + ' ' + shape.x + ' ' + shape.y + ' ' + shape.z));
    }
}

export {Scene};