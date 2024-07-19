const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const animesFilePath = path.join(__dirname, "../../data/animes.json");

//Leer los animes desde el archivo
function readAnimes () {
    const animeData = fs.readFileSync(animesFilePath);
    return JSON.parse(animeData); // Retorne los datos en formato JSON
};

//Escribir animes en el archivo
function writeAnimes (animes) {
    fs.writeFileSync(animesFilePath, JSON.stringify(animes, null, 2));
};

//Crear un nuevo anime.
router.post("/", (req, res) => {
    const animes = readAnimes();
    const newAnime = {
        id: animes.length + 1,
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId
    };
    animes.push(newAnime);
    writeAnimes(animes);
    res.status(201).json({messaje: "Anime creado exitosamente", task: newAnime});
});

//Obtener todos los animes
router.get("/", (req, res) => {
    const animes = readAnimes();
    res.json(animes);
});

//Obtener un anime por ID
router.get("/:id", (req, res) => {
    const animes = readAnimes();
    const anime = animes.find(anime => anime.id === parseInt(req.params.id));
    if (!anime) {
        return res.status(404).json({message: "Anime no encontrado"});
    }
    res.json(anime);
});

//Actualizar un anime por ID
router.put("/:id", (req, res) => {
    const animes = readAnimes();
    const animeIndex = animes.findIndex((anime) => anime.id === parseInt(req.params.id));
    if(animeIndex === -1) {
        return res.status(404).json({message: 'Anime no existe'});
    }
    const updatedAnime = {
        ...animes[animeIndex],
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId
    };
    animes[animeIndex] = updatedAnime;
    writeAnimes(animes);
    res.json({message: "Anime actualizado exitosamente", anime: updatedAnime});
})

//Eliminar un anime por ID
router.delete("/:id", (req, res) => {
    const animes = readAnimes();
    const newAnimes = animes.filter((anime) => anime.id !== parseInt(req.params.id));
    if (animes.length === newAnimes.length) {
        return res.status(404).json({message: "Tarea no encontrada"});
    }
    writeAnimes(newAnimes);
    res.json({message: "Anime eliminado exitosamente"});
});

module.exports = router;