# TFG_Server

Paquetes instalados y configuración

	npm init -y

https://www.npmjs.com/package/ts-node

	npm install typescript -s
	tsc --init
	Definir el directorio de salida "outDir" como "dist"


https://www.npmjs.com/package/ts-node-dev

	npm install ts-node-dev -s -D
	"package.json" -> scripts , añadir "dev": "ts-node-dev --respawn --transpile-only server.ts"

Web Sockets				https://www.npmjs.com/package/ws			

	npm i ws


Sistema de archivos			https://www.npmjs.com/package/file-system 	

	npm i file-system --save
	npm i --save-dev @types/node		(tipos para typescript)


Generar certificado SSL

  Abrir terminal con ssl
  
	openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365		generar las claves
	openssl rsa -in key.pem -out key-rsa.pem						codificar key.pem


Base de datos

	npm i knex				Knex 
	npm install pg --save			PostgreSQL

PostgreSQL (cliente base de datos)	https://www.npmjs.com/package/pg		
	
	npm install pg --save		

Encriptación para las contraseñas de la base de datos	https://www.npmjs.com/package/bcrypt	

	npm i bcrypt

