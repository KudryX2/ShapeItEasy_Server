import { NumericLiteral } from "typescript";

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
        shareViewID : string
        shareEditID : string
    }

    export interface Shared{
        userID : string,
        sceneID : string,
        permissions : string
    }

    export interface Shape{
        id : string,
        kind : string,
        
        x : number,     // Position
        y : number,
        z : number,

        sx : number,    // Scale
        sy : number,
        sz : number,

        rx : number,    // Rotation
        ry : number,
        rz : number,

        sceneID : string
    }

    export interface Vector3{
        x : number, 
        y : number,
        z : number
    }

    export interface AddShapeRequest{
        shape : string,
        position : Vector3
        sceneID : string
    }

    export interface UpdateShapeRequest{
        shapeID : string,
        position : Vector3,
        scale : Vector3,
        rotation : Vector3,

        sceneID : string
    }

    export interface DeleteShapeRequest{
        shapeID : string,
        sceneID : string
    }

}


export {Interfaces};