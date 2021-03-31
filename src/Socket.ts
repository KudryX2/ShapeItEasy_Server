const ENCODER = new TextEncoder();


module Socket{

    export function write(socket : WebSocket, kind : string, content : string){
	
		let messageJSON : JSON = <JSON><unknown>{
			'kind' : kind,
			'content' : content
		};
	
		try{
			socket.send(ENCODER.encode(JSON.stringify(messageJSON)));
		}catch(exception){
			console.log('Error escribiendo en el socket ' + exception);
		}
	} 
    
}

export {Socket};