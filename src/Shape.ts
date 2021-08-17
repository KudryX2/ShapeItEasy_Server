class Shape{

    id : string;
    kind : string;
    x : number;
    y : number;
    z : number;

    constructor(id : string, kind : string, x : number, y : number, z : number){
        this.id = id;
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public getJSON() : JSON{
        return <JSON><unknown>{'id' : this.id, 'kind' : this.kind, 'x' : this.x, 'y' : this.y, 'z' : this.z};
    }

}

export {Shape};