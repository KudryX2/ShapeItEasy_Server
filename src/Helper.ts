module Helper{
 
    /*
        Random token generator
    */
    export function generateToken(lenght : number) : string{
        let token : string = '';
        let elementsToUse : string = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIKLMNOPQRSTVXYZ';
    
        for(let i = 0 ; i < lenght ; ++i)
            token += elementsToUse.charAt(Math.floor(Math.random() * elementsToUse.length));
    
        return token;
    }

    /*
        Data validation
    */
    export enum DataKind {
        text, 
        email
    }

    var textTegex = /^[0-9a-zA-Zñ]+$/;
    var emailRegex = /^[0-9a-zA-Z@.ñ]+$/;

    export function validate(data : string, dataKind : DataKind){

        if(dataKind == DataKind.text)
            return textTegex.test(data);

        else if(dataKind == DataKind.email)
            return emailRegex.test(data);

    }

}

export {Helper};