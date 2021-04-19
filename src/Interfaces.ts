module Interfaces {

    export interface Request{                                                     
        kind : string;
        token : string;
        content : string;
    }
    
    export interface User{
        id : string,
        name : string,
        email : string,
        password : string
    }

    export interface ScenesList{
        name : string;
    }

    export interface Scene{
        id : string,
        name : string,
        description : string
    }

}


export {Interfaces};