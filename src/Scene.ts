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

    removeConnection(clientToken : string) : void{
        try{
            this.connections.splice(this.connections.indexOf(clientToken));
        }catch(exception){
            console.log('El usuario no estaba conectado a esta escena');
        }
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