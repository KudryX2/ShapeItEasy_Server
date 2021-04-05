module Interfaces {

    export interface Request{                                                     
        kind : string;
        token : string;
        content : string;
    }
    
    export interface UserCredentials{
        userName : string;
        userPassword : string;
    }

    export interface SignInData{
        userName : string,
        userEmail : string,
        userPassword : string
    }


    export interface ScenesList{
        name : string;
    }


}


export {Interfaces};