import { Router } from 'express';
// como estamos trabajando con promesas importamos promises as fs y utilizamos el fs con asincronismo ejemplo: fs.readFile
//Si fuera sincronico tendriamos que inportar por ejemplo readFileSync y tulizarlo readFileSync();
import { promises as fs } from 'fs';
// importamos el modulo path que esta incoporado en Node.js el primer 'path' es el módulo que se esta importando y el segundo especifica la fuente del módulo
//proporciona utilidades para trabajar con rutas de archivos y directorios
import path from 'path';
//Estamos importando la función fileURLToPath del módulo URL que esta incorporado en Node.js
//se utiliza para convertir un objeto URL (o una cadena de URL que representa un archivo) en una ruta de archivo de sistema
import { fileURLToPath } from 'url';

const router = Router();
const _filename = fileURLToPath(import.meta.url);//Estamos trabajando con modulos debes primero traer el filename
const _dirname = path.dirname(_filename);//Convertimos a dirname
const animesFilePath = path.join(_dirname, "../../data/animes.json");//El dirname obtiene el directorio del archivo actual

//Leer los animes desde el archivo
async function readAnimes() {
    try {
        const animeData = await fs.readFile(animesFilePath);//Llamamos la función readfile del módulo fs para que lea el contenido del archivo en la ruta animesFilePath
        return JSON.parse(animeData); // Retorne los datos en formato JSON
    } catch (error) {
        throw new Error(`Error en la promesa ${err.message}`);
    }

};

//Escribir animes en el archivo
//El parametro animes contiene los datos de animes a escribir en el archivo
async function writeAnimes(animes) {
    try {
        //Llamamos la función writeFile del módulo fs para escribir los datos en el archivo en la ruta animesFilePath
        //JSON.stringify(animes, null, 2) convierte el objeto 'animes' a una cadena de texto en formato JSON con una sandría de 2 espacios para mejor legibilidad
        await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2));
    } catch (error) {
        throw new Error(`Error en la promesa ${err.message}`);
    }

};

//Crear un nuevo anime.
//req recibe los objetos de las solicitud y res es la respuesta que se le envia al cliente
router.post("/", async (req, res) => {
    const animes = await readAnimes(); //esta función almacena los datos de animes que lee la función readAnimes() desde un archivo, básicamente es traer los animes que hay alamcenados
    //creamos el objeto del nuevo anime
    const newAnime = {
        id: animes.length + 1, //iniciamos con un array vacio entonces sería 0 + 1 = 1
        title: req.body.title, //El título se le asigna en el cuerpo de la solicitud 
        gender: req.body.gender,//El genero se le asigna en el cuerpo de la solicitud 
        studioId: req.body.studioId//El estudio se le asigna en el cuerpo de la solicitud 
    };
    animes.push(newAnime); //Agregamos el objeto newAnime al final del array animes
    await writeAnimes(animes);//Esta función escribe los datos actualizados de animes en el archivo JSON
    res.status(201).json({ messaje: "Anime creado exitosamente", Anime: newAnime });//Mensaje de confirmación de que fue agregado correctamente
});

//Obtener todos los animes
router.get("/", async (req, res) => {
    const animes = await readAnimes(); //traer los animes que hay alamcenados
    res.json(animes); // se muestra la respuesta en formato json
});

//Obtener un anime por ID
router.get("/:id", async (req, res) => {
    const animes = await readAnimes();// traemos todos los animes almacenados
    //Busca en el array de animes el primer elemento cuyo 'id' sea exactamente igual con el 'id' especificado en la URL req.params.id ejemplo (http://localhost:3000/animes/1)
    //El parseInt convierte el id a un número entero
    //Entonces la variable guarda el anime encontrado  en la constante anime del método find y si no encuentra anime será undefined
    const anime = animes.find(anime => anime.id === parseInt(req.params.id));
    if (!anime) {
        //verifica si anime es undefined es decir que no encontró ningún animes con el ID especificado
        //entonces responde 
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    //si el anime fue encontrado, envía una respuesta en formato JSON con los detalles del anime
    res.json(anime);
});

//Actualizar un anime por ID
router.put("/:id", async (req, res) => {
    const animes = await readAnimes(); //traemos todos los animes almacenados
    //Busca el índice del primer elemento en el array 'animes' cuyo 'id' coincida con el 'id' especificado en la URL req.params.id ejemplo (http://localhost:3000/animes/1)
    //const array1 = [5, 12, 8, 130, 44];
    //const isLargeNumber = (element) => element > 13;
    //console.log(array1.findIndex(isLargeNumber));
    // resultado: 3 que es la posición del número 130 el cual cumple la condición de ser mayor a 13 y asu vez es el primer elemento en el orden del array que cumplió esa condición
    //la contante animeIndex alamcena el indice del anime encontrado, si no encuentra ningún anime con el ID especificado, animeIndex será igual a -1
    const animeIndex = animes.findIndex((anime) => anime.id === parseInt(req.params.id));
    if (animeIndex === -1) {
        //Verifica si animeIndex es -1, lo que significa que no se encontró ningún anime con el ID especificado.
        //entonces responde 
        return res.status(404).json({ message: 'Anime no existe' });
    }
    //Esta constante crea el nuevo objeto con los campos de abajo
    const updatedAnime = {
        ...animes[animeIndex],////me estoy trayendo el objeto que encontro en la posición (operador de propagación). Copia todas las propiedad del objeto 'anime' encontrado
        title: req.body.title,//Actualiza el título del anime con el valor proporcionado en el cuerpo de la solicitud
        gender: req.body.gender,//Actualiza el genero del anime con el valor proporcionado en el cuerpo de la solicitud
        studioId: req.body.studioId//Actualiza el estudio del anime con el valor proporcionado en el cuerpo de la solicitud
    };
    animes[animeIndex] = updatedAnime; // reemplaza el objeto de anime en el índice encontrado con el objeto 'updateAnime'
    await writeAnimes(animes); //escribe los datos actualizados de animes en el archivo JSON
    res.json({ message: "Anime actualizado exitosamente", anime: updatedAnime });//respuesta que recibe el cliente
})

//Eliminar un anime por ID
router.delete("/:id", async (req, res) => {
    const animes = await readAnimes(); ////traemos todos los animes almacenados
    //El método filter crea un nuevo array que contiene todos los elementos del array 'animes' excepto el que tiene un 'id' que coincide con el 'id' especificado en la URL req.params.id ejemplo (http://localhost:3000/animes/1)
    //Entonces la constante alamacena el nuevo array de animes sin el que coincidió con el 'id' especificado
    const newAnimes = animes.filter((anime) => anime.id !== parseInt(req.params.id)); 
    if (animes.length === newAnimes.length) {
        //verifica si la longitud del array original 'animes' es igual a la longitud del nuevo array 'newAnimes'. 
        //Si son iguales significa que no se encontro ningún anime con el ID especificado y por lo tanto no se eliminó ningún anime
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    await writeAnimes(newAnimes); //escribe los datos actualizados de animes en el archivo JSON
    res.json({ message: "Anime eliminado exitosamente" });//respuesta que recibe el cliente
});

//Otra forma de hacerlo
// router.delete("/:id", async (req, res) => {
//     const animes = await readAnimes();
//     const animeIndex = animes.findIndex((anime) => anime.id === parseInt(req.params.id));
//     if (!animeIndex === -1) return res.status(404).send("Anime no encontrado");
//     const deleteanime = animes.splice(animeIndex, 1);
//     await writeAnimes(deleteanime);
//     res.status(200).json({message: "Anime eliminado exitosamente"});
// });

export default router;