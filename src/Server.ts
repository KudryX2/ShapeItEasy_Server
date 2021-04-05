'use strict';

const FS = require('fs');
const HTTPS = require('https');
const WebSocketServer = require('ws').Server;

import {Interfaces} from "./Interfaces";			// Requests interfaces, used for parsing
import {ScenesManager} from "./ScenesManager";
import {ClientsManager} from "./ClientsManager";
import {Database} from "./Database";

const DECODER = new TextDecoder();


const SERVER = HTTPS.createServer({					// Server
	cert: FS.readFileSync('cert/cert.pem'),
	key: FS.readFileSync('cert/key.pem'),
	passphrase : 'patopato'
});

SERVER.listen(2323, () => {
	console.log('WebServer : OK');
	
	Database.connect();
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
		if(request.kind == 'logInRequest')       			// Users requests
			ClientsManager.handleLogInRequest(socket, request);
	
		else if(request.kind == 'signInRequest')
			ClientsManager.handleSignInRequest(socket, request);

		else if(request.kind == 'requestScenesList')		// Scenes requests
			ScenesManager.handleScenesListRequest(socket, request);

		else if(request.kind == 'requestCreateScene')
			ScenesManager.handleCreateSceneRequest(socket, request);

		else if(request.kind == 'requestEditScene')
			ScenesManager.handleEditSceneRequest(socket, request);

		else if(request.kind == 'requestDeleteScene')
			ScenesManager.handleDeleteSceneRequest(socket, request);

		else                                           		// NOT DEFINED KIND
			console.log('Petición de tipo desconocido ' + data.toString());

	}

}