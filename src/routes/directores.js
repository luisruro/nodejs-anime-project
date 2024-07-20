import { Router } from "express";
 import { promises as fs } from "fs";
 import path from "path";
 import { fileURLToPath } from "url";

 const routerDirectores = Router();
 const _filename = fileURLToPath(import.meta.url);
 const _dirname = path.dirname(_filename);
 const directoresFilePath = path.join(_dirname, "../../data/directores.json"); 

 // Leer los directores desde el archivo
 const readDirectores = async () => {
    try {
        const directoresData = await fs.readFile(directoresFilePath, "utf8");
        return JSON.parse(directoresData);
    } catch (error) {
        throw new Error(error.message);
    }
 };

 // Escribir directores en el archivo
 const writeDirectores = async (directores) => {
    try {
        await fs.writeFile(directoresFilePath, JSON.stringify(directores, null, 2));
    } catch (error) {
        throw new Error(error.message);
    }
 };

 //Crear un nuevo director
 routerDirectores.post("/addDirector", async (req, res) => {
    const directores = await readDirectores();
    const newDirector = {
        id: directores.length + 1,
        name: req.body.name
    };
    directores.push(newDirector);
    await writeDirectores(directores);
    res.status(201).json({ message: "Director agregado exitosamente", Director: newDirector});
 });

 // Obtener todos los directores
 routerDirectores.get("/getDirector", async (req, res) => {
    const directores = await readDirectores();
    res.json(directores);
 });

 // Obtener un director por ID

 routerDirectores.get("/getDirector/:id", async (req, res) => {
    const directores = await readDirectores();
    const director = directores.find((director) => director.id === parseInt(req.params.id));
    if(!director) {
        return res.status(404).json({ message: "Director no encontrado."});
    }
    res.json(director);
 });

 //Actualizar un director por ID
 
 routerDirectores.put("/updateDirector/:id", async (req, res) => {
    const directores = await readDirectores();
    const directorIndex = directores.findIndex((director) => director.id === parseInt(req.params.id));
    if(directorIndex === -1) {
        return res.status(404).json({message: "Director no existe"});
    }
    const updateDirector = {
        ...directores[directorIndex],
        name: req.body.name
    };
    directores[directorIndex] = updateDirector;
    await writeDirectores(directores);
    res.json({ message: "Director actualizado exitosamente", director: updateDirector});
 });

 // Eliminar un director por ID

 routerDirectores.delete("/deleteDirector/:id", async (req, res) => {
    const directores = await readDirectores();
    const newDirectores = directores.filter((director) => director.id !== parseInt(req.params.id));
    if(newDirectores.length === directores.length) {
        return res.status(404).json({message: "Director no encontrado"});
    }
    await writeDirectores(newDirectores);
    res.json({ message: "Director eliminado exitosamente"});
 });

 export default routerDirectores;