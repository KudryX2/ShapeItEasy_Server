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
        email,
        shareID
    }

    var textTegex = /^[0-9a-zA-Zñ]+$/;
    var emailRegex = /^[0-9a-zA-Z@.ñ]+$/;
    var shareIDRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

    
    export function validate(data : string, dataKind : DataKind){

        if(dataKind == DataKind.text)
            return textTegex.test(data);

        else if(dataKind == DataKind.email)
            return emailRegex.test(data);

        else if(dataKind == DataKind.shareID)
            return shareIDRegex.test(data);

    }

}

export {Helper};