'use strict';
const FS = require('fs');
const HTTPS = require('https');
const WebSocketServer = require('ws').Server;


import {Helper} from "./Helper";					// Aux methods
import {Interfaces} from "./Interfaces";			// Requests interfaces, used for parsing


const DECODER = new TextDecoder();
const ENCODER = new TextEncoder();


const SERVER = HTTPS.createServer({					// Server
	cert: FS.readFileSync('cert/cert.pem'),
	key: FS.readFileSync('cert/key.pem'),
	passphrase : 'patopato'
});

SERVER.listen(2323, () => {
	console.log('Listening');
});

const wss = new WebSocketServer({server: SERVER});	// Web Socket

wss.on('connection', (ws : any) =>{

	ws.on('message', (data : any) => {
		processRequest(data, ws);
	});

});


let clientsMap = new Map();


function processRequest(data : BufferSource, socket : WebSocket) : void{ 

	let dataString : string = DECODER.decode(data); 
	let parseOK : boolean = false;

	let request : Interfaces.Request = JSON.parse('{}');

	try{												// Parse the request
		request = JSON.parse(dataString);
		parseOK = true;
	}catch(exception){
		console.log('La petición no es un JSON, petición : ' + dataString);
	}

	if(parseOK){										// If parsed handle the request	
		if(request.kind == 'requestUserToken')       		// Request user token
			handleUserTokenRequest(socket, request);
	
		else                                           		// NOT DEFINED KIND
			console.log('Petición de tipo desconocido ' + data.toString());

	}

}

function writeToSocket(socket: WebSocket, kind:string, content:string){

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


function handleUserTokenRequest(socket : WebSocket, request: Interfaces.Request){

	let userCredentials = JSON.parse(request.content);
	let token = "";

	if(checkUserCredentials(userCredentials)){				// Check user credentials
		token = Helper.generateRandomToken(10);             	// Create random token for the user
		clientsMap.set(token, userCredentials.userName);    	// Save the token and user
	}

	writeToSocket(socket, 'tokenCallback', token);
}

function checkUserCredentials(credentials : Interfaces.UserCredentials) : boolean{
	// TODO comprobar que el usuario existe y la contraseña coincide

	return true;
}