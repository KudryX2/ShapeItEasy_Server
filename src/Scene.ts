import {Helper} from "./Helper";

interface SceneInterface{
    name : string
}

class Scene{

    name : string;
    sceneShareViewID : string;
    sceneShareEditID : string;

    clients : Array<string>;
    
    constructor(name : string){
        this.name = name;

        this.sceneShareViewID = Helper.generateToken(15);
        this.sceneShareEditID = Helper.generateToken(15);

        this.clients = new Array<string>();
    }

    addClient(client : string) {
        
    }

    getJSON() : JSON {

        let json : JSON = <JSON><unknown>{
            'name' : this.name
        };

        return json;
    }

}

export {Scene};