import { Router } from 'express';
// como estamos trabajando con promesas importamos promises as fs y utilizamos el fs con asincronismo ejemplo: fs.readFile
//Si fuera sincronico tendriamos que informar por ejemplo readFileSync y tulizarlo readFileSync();
import { promises as fs } from 'fs'; 
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const _filename = fileURLToPath(import.meta.url);//Estamos trabajando con modulos debes primero traer el filename
const _dirname = path.dirname(_filename);//Convertimos a dirname
const animesFilePath = path.join(_dirname, "../../data/animes.json");

//Leer los animes desde el archivo
async function readAnimes() {
    try {
        const animeData = await fs.readFile(animesFilePath);
        return JSON.parse(animeData); // Retorne los datos en formato JSON
    } catch (error) {
        throw new Error(`Error en la promesa ${err.message}`);
    }

};

//Escribir animes en el archivo
async function writeAnimes(animes) {
    try {
        await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2));
    } catch (error) {
        throw new Error(`Error en la promesa ${err.message}`);
    }
    
};

//Crear un nuevo anime.
router.post("/", async (req, res) => {
    const animes = await readAnimes();
    const newAnime = {
        id: animes.length + 1,
        title: req.body.title,
        gender: req.body.gender,
        //studioId: req.body.studioId
    };
    animes.push(newAnime);
    await writeAnimes(animes);
    res.status(201).json({ messaje: "Anime creado exitosamente", Anime: newAnime });
});

//Obtener todos los animes
router.get("/", async (req, res) => {
    const animes = await readAnimes();
    res.json(animes);
});

//Obtener un anime por ID
router.get("/:id", async (req, res) => {
    const animes = await readAnimes();
    const anime = animes.find(anime => anime.id === parseInt(req.params.id));
    if (!anime) {
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    res.json(anime);
});

//Actualizar un anime por ID
router.put("/:id", async (req, res) => {
    const animes = await readAnimes();
    const animeIndex = animes.findIndex((anime) => anime.id === parseInt(req.params.id));
    if (animeIndex === -1) {
        return res.status(404).json({ message: 'Anime no existe' });
    }
    const updatedAnime = {
        ...animes[animeIndex],////me estoy trayendo el objeto que encontro en la posición (operador de propagación)
        title: req.body.title,
        gender: req.body.gender,
        studioId: req.body.studioId
    };
    animes[animeIndex] = updatedAnime;
    await writeAnimes(animes);
    res.json({ message: "Anime actualizado exitosamente", anime: updatedAnime });
})

//Eliminar un anime por ID
router.delete("/:id", async (req, res) => {
    const animes = await readAnimes();
    const newAnimes = animes.filter((anime) => anime.id !== parseInt(req.params.id));
    if (animes.length === newAnimes.length) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }
    await writeAnimes(newAnimes);
    res.json({ message: "Anime eliminado exitosamente" });
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