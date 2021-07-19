import {Helper} from "./Helper";

interface SceneInterface{
    name : string
}

class Scene{

    id : string;
    name : string;

    connections : Array<string>;
    
    
    constructor(id : string, name : string){
        this.id = id;
        this.name = name;

        this.connections = new Array<string>();
    }

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
        this.connections.forEach((connection : string) => console.log('. ' + connection));
    }

}

export {Scene};