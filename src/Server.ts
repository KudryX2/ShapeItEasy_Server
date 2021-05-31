'use strict';

const FS = require('fs');
const HTTPS = require('https');
const WebSocketServer = require('ws').Server;

import {Interfaces} from "./Interfaces";			// Requests interfaces, used for parsing
import {ScenesManager} from "./ScenesManager";
import {ClientsManager} from "./ClientsManager";


const DECODER = new TextDecoder();
const DATABASE = require('./database/Database');


const SERVER = HTTPS.createServer({					// Server
	cert: FS.readFileSync('cert/cert.pem'),
	key: FS.readFileSync('cert/key.pem'),
	passphrase : 'patopato'
});

SERVER.listen(2323, () => {
	console.log('WebServer : OK');

//	DATABASE.migrate.down();
	DATABASE.migrate.latest();

//	DATABASE.seed.run();			
});

const wss = new WebSocketServer({server: SERVER});	// Web Socket

wss.on('connection', (ws : any) =>{

	ws.on('message', (data : any) => {
		processRequest(data, ws);
	});

});

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
		
		console.log("Request : " + request.kind);

		if(request.token == '')											// No token -> Not restricted requests
			processNotRestrictedRequest(request, socket);
		
		else if(ClientsManager.getUser(request.token) != undefined) 	// Valid token -> Restricted requests
			processRestrictedRequest(request, socket);
		
		else															
			console.log('Intento de realizar una petición sin un token válido')

	}

}


function processNotRestrictedRequest(request : Interfaces.Request, socket : WebSocket){

	if(request.kind == 'logInRequest')      					// Handle Log In Request 			
		ClientsManager.handleLogInRequest(socket, request);

	else if(request.kind == 'signUpRequest')					// Handle Sign In Request
		ClientsManager.handleSignInRequest(socket, request);

	else 
		console.log('Tipo de petición no restringida desconocido ' + request.kind);

}


function processRestrictedRequest(request : Interfaces.Request, socket : WebSocket){
	
	if(request.kind == 'logOutRequest')							// Handle Log Out Request
		ClientsManager.handleLogOutRequest(socket, request);
	
	else if(request.kind == 'requestScenesList')				// Handle Scenes Request					
		ScenesManager.handleScenesListRequest(socket, request);

	else if(request.kind == 'requestCreateScene')
		ScenesManager.handleCreateSceneRequest(socket, request);

	else if(request.kind == 'requestEditScene')
		ScenesManager.handleEditSceneRequest(socket, request);

	else if(request.kind == 'requestDeleteScene')
		ScenesManager.handleDeleteSceneRequest(socket, request);

	else if(request.kind == 'requestAddScene')
		ScenesManager.handleAddSceneRequest(socket, request);

	else if(request.kind == 'requestConnect')
		ScenesManager.handleConnectRequest(socket, request);

	else if(request.kind == 'requestDisconnect')
		ScenesManager.handleDisconnectRequest(socket, request);

	else                                           				// NOT DEFINED KIND
		console.log('Tipo de petición desconocido ' + request.kind);

}