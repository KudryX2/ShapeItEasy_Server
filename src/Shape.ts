class Shape{

    kind : string;
    x : number;
    y : number;
    z : number;

    constructor(kind : string, x : number, y : number, z : number){
        this.kind = kind;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public getJSON() : JSON{
        return <JSON><unknown>{'kind' : this.kind, 'x' : this.x, 'y' : this.y, 'z' : this.z};
    }

}

export {Shape};