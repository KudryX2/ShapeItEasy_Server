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


}


export {Interfaces};