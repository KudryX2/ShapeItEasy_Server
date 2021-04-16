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

    export interface UserCredentials{
        email : string;
        password : string;
    }

    export interface SignInData{
        name : string,
        email : string,
        password : string
    }



    export interface ScenesList{
        name : string;
    }

    export interface UpdateSceneRequest{
        id : string,
        newName : string
    }

}


export {Interfaces};