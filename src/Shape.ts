import {Interfaces} from "./Interfaces";


class Shape{

    id : string;
    kind : string;
    
    x : number;     // Position
    y : number;
    z : number;

    sx : number;    // Scale
    sy : number;
    sz : number;

    rx : number;    // Rotation
    ry : number;
    rz : number;

    
    constructor(id : string, kind : string, x : number, y : number, z : number, sx : number, sy : number, sz : number, rx : number, ry : number, rz : number){
        this.id = id;
        this.kind = kind;

        this.x = x;     // Postion
        this.y = y;
        this.z = z;

        this.sx = sx;   // Scale
        this.sy = sy;
        this.sz = sz;

        this.rx = rx;   // Rotaion
        this.ry = ry;
        this.rz = rz;
    }

    public update(updateShapeRequest : Interfaces.UpdateShapeRequest){
        this.x = updateShapeRequest.position.x;
        this.y = updateShapeRequest.position.y;
        this.z = updateShapeRequest.position.z;

        this.sx = updateShapeRequest.scale.x;
        this.sy = updateShapeRequest.scale.y;
        this.sz = updateShapeRequest.scale.z;

        this.rx = updateShapeRequest.rotation.x;
        this.ry = updateShapeRequest.rotation.y;
        this.rz = updateShapeRequest.rotation.z;
    }

    public getJSON() : JSON{
        return <JSON><unknown>{'id' : this.id, 'kind' : this.kind,  'x' : this.x, 'y' : this.y, 'z' : this.z,
                                                                    'sx' : this.sx, 'sy' : this.sy, 'sz' : this.sz, 
                                                                    'rx' : this.rx, 'ry' : this.ry, 'rz' : this.rz};
    }

}

export {Shape};