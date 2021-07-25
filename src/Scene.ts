import {Helper} from "./Helper";
import {Shape} from "./Shape";
import {Interfaces} from "./Interfaces";



interface SceneInterface{
    name : string
}

class Scene{

    id : string;
    name : string;

//    connections : Array<string>;
    shapes : Array<Shape>;
    clientSockets : Array<WebSocket>;

    connections : Map<string, WebSocket>;
    
    constructor(id : string, name : string){
        this.id = id;
        this.name = name;

        // this.connections = new Array<string>();
        this.connections = new Map<string, WebSocket>();
        this.shapes = new Array<Shape>();
        this.clientSockets = new Array<WebSocket>();
    }

    /*
        Connection methods
    */
    addConnection(clientToken : string, socket : WebSocket) : void{
        this.connections.set(clientToken, socket);

        this.printConnections();
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
    addShape(addShapeRequest : Interfaces.AddShapeRequest) : void{
    
        let newShape : Shape = new Shape(addShapeRequest.shape, addShapeRequest.x, addShapeRequest.y, addShapeRequest.z);
        this.shapes.push(newShape);
    }

    printShapesList() : void {
        console.log("Shapes : " + this.name + " ");
        this.shapes.forEach((shape : Shape) => console.log(shape.name + ' ' + shape.x + ' ' + shape.y + ' ' + shape.z));
    }
}

export {Scene};