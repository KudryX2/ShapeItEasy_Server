import {Helper} from "./Helper";
import {Shape} from "./Shape";
import {Interfaces} from "./Interfaces";



interface SceneInterface{
    name : string
}

class Scene{

    id : string;
    name : string;

    connections : Array<string>;
    shapes : Array<Shape>;
    
    constructor(id : string, name : string){
        this.id = id;
        this.name = name;

        this.connections = new Array<string>();
        this.shapes = new Array<Shape>();
    }

    /*
        Connection methods
    */
    addConnection(clientToken : string) : void{
        this.connections.push(clientToken);
    }

    removeConnection(clientToken : string) : boolean{

        if(this.connections.includes(clientToken)){         // If contains connection -> remove connection 
            this.connections.splice(this.connections.indexOf(clientToken));
            return true;
        }

        return false;                                       // Return false if no coincidence 
    }

    getConnectionsAmmount() : number {
        return this.connections.length;
    }

    printConnections() : void {
        console.log("Connections : " + this.name + " ");
        this.connections.forEach((connection : string) => console.log(connection));
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