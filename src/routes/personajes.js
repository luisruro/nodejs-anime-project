import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const routerPersonajes = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const personajesFilePath = path.join(_dirname, "../../data/personajes.json");

// Leer los personajes desde el archivo
const readPersonajes = async () => {
    try {
        const personajesData = await fs.readFile(personajesFilePath, 'utf-8');
        return JSON.parse(personajesData);
    } catch (error) {
        throw new Error(error.message);
    }
};

// Escribir personajes en el archivo
const writePersonajes = async (personajes) => {
    try {
        await fs.writeFile(personajesFilePath, JSON.stringify(personajes, null, 2));
    } catch (error) {
        throw new Error(error.message);
    }
};

// Crear un nuevo personaje

routerPersonajes.post("/", async (req, res) => {
    const animeUrl = await fetch(`http://localhost:3000/animes/${req.body.animeId}`);//Esto es paras que cuando ingresen en el body request el numero del id busque la entidad de animes
    const personajes = await readPersonajes();
    const newPersonaje = {
        id: personajes.length + 1,
        name: req.body.name,
        animeId: await animeUrl.json()// apesar de que el nombre es json, este retorna es un objeto de javascript
    };
    personajes.push(newPersonaje);
    await writePersonajes(personajes);
    res.status(201).json({ message: "Personaje creado exitosamente", personaje: newPersonaje });
});

// Obtener todos los personajes

routerPersonajes.get("/", async (req, res) => {
    const personajes = await readPersonajes();
    res.json(personajes);
});

// Obtener un personaje por ID

routerPersonajes.get("/:id", async (req, res) => {
    const personajes = await readPersonajes();
    const personaje = personajes.find((personaje) => personaje.id === parseInt(req.params.id));
    if (!personaje) {
        return res.status(404).json({ message: "Personaje no encontrado" });
    }
    res.json(personaje);
});

// Actualizar un personaje por ID

routerPersonajes.put("/:id", async (req, res) => {
    const animeUrl = await fetch(`http://localhost:3000/animes/${req.body.animeId}`);
    const personajes = await readPersonajes();
    const personajeIndex = personajes.findIndex((personaje) => personaje.id === parseInt(req.params.id));
    if (personajeIndex === -1) {
        return res.status(404).json({ message: "Personaje no encontrado" });
    }
    const updatedPersonaje = {
        ...personajes[personajeIndex],
        name: req.body.name,
        animeId: await animeUrl.json()
    }
    personajes[personajeIndex] = updatedPersonaje;
    await writePersonajes(personajes);
    res.json({ message: "Personaje actualizado correctamente", personaje: updatedPersonaje });
});

// Eliminar un personaje por ID

routerPersonajes.delete("/:id", async (req, res) => {
    const personajes = await readPersonajes();
    const newPersonajes = personajes.filter((personaje) => personaje.id === parseInt(req.params.id));
    if (personajes.length !== newPersonajes.length) {
        await writePersonajes(newPersonajes);
        res.json({ message: "Personaje eliminado correctamente" });
    }
    return res.status(404).json({ message: "Personaje no encontrado" });
});

export default routerPersonajes;