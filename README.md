# nodejs-anime-project

## Dependencia de producción

***Instalamos express*** 

 - npm install express

## Dependencia de desarrollo

***Instalamos Nodemon***

 - npm install nodemon -D
 - En el archivo **package.json** se mostrará lo siguiente:
 
       },
        "devDependencies": {
        "nodemon": "^3.1.4"
       }


## Configurar variables de entorno
***Ejecutamos el comando*** 

 - npm install dotenv
 - En el archivo **package.json** se debe de agregar en las dependencias "dotenv": "^16.4.5" así:

	     },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "description": "",
        "dependencies": {
        "dotenv": "^16.4.5",
        "express": "^4.19.2"
	    },

Creamos el archivo **.env** y establecemos las variables, ejemplo:
PORT=3000

**Nota:** en este proyecto no se configuraron variables de entorno.

## Para trabajar con modulos hacemos lo siguiente:

 - En el archivo package.json agregamos debajo de "main", "type":   
   "module" así:

	    "name": "nodejs-anime-project-class",
	    "version": "1.0.0",
	    "main": "index.js",
	    "type": "module",

**Para ejecutar nuestro el proyecto con npm run dev y no hacerlo por ejemplo node [nombre del archivo], hacemos lo siguiente:**

 - Agregamos en el package.json debajo de "test", "dev": "nodemon" así:

	    "scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1",
	    "dev": "nodemon"
	    },
