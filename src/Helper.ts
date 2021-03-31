module Helper{
 
    export function generateToken(lenght : number) : string{
        let token : string = '';
        let elementsToUse : string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIKLMNOPQRSTVXYZ';
    
        for(let i = 0 ; i < lenght ; ++i)
            token += elementsToUse.charAt(Math.floor(Math.random() * elementsToUse.length));
    
        return token;
    }

}

export {Helper};