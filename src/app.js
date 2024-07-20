//importamos Express
import express from "express";
//Importamos las rutas de la API
import router from "./routes/animes.js";
import routerDirectores from "./routes/directores.js";
import routerEstudios from "./routes/estudios.js";
// const directoresRoutes = require("./routes/directores");
// const estudiosRoutes = require("./routes/estudios");
// const personajesRoutes = require("./routes/personajes");
//Importamos el middleware de manejo de errores
import errorHandler from "./middlewares/errorHandler.js";



//Creamos una nueva instancia de Express
const app = express();
//Definimos el puerto del servidor donde se ejecutará la API
const PORT = 3000;

//Middleware para parsear los datos JSON de las peticiones

//Hace que el cuerpo de las solicitudes HTTP por ejemplo el envio de datos de un formulario, esos datos no estan automáticamente disponibles en la app del servidor, 
//entonces se deben convertir a un objeto de javascript
app.use(express.json());
//Middleware de enrutamiento por ejemplo cualquier solicitud cuya ruta comience con /animes ejemplo("/animes/1, /animes/create") debe ser manejada por el enrutador animeRoutes que fue declarada arriba.
app.use("/animes", router);
app.use("/directores", routerDirectores);
app.use("/estudios", routerEstudios);
// app.use("/personajes", personajesRoutes);
//Middleware para manejo de errores
app.use(errorHandler);

//Inicia el servidor y hace que escuche en el puerto definido
//Cuando el servidor está listo, imprime un mensaje en la consola indicando la URL en la que está
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});