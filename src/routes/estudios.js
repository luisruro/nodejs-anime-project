import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const routerEstudios = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const estudiosFilePath = path.join(_dirname, "../../data/estudios.json");

// Leer los estudios desde el archivo
const readEstudios = async () => {
    try {
        const estudiosData = await fs.readFile(estudiosFilePath, "utf8");
        return JSON.parse(estudiosData);
    } catch (error) {
        throw new Error(error.message);
    }
};

// Escribir estudios en el archivo
const writeEstudios = async (estudios) => {
    try {
        await fs.writeFile(estudiosFilePath, JSON.stringify(estudios, null, 2));
    } catch (error) {
        throw new Error(error.message);
    }
};

// Crear un nuevo estudio

routerEstudios.post("/", async (req, res) => {
    const estudios = await readEstudios();
    const newEstudio = {
        id: estudios.length + 1,
        name: req.body.name
    };
    estudios.push(newEstudio);
    await writeEstudios(estudios);
    res.status(201).json({message: "Estudio agregado exitosamente", estudio: newEstudio});
});

// Obtener todos los estudios

routerEstudios.get("/", async (req, res) => {
    const estudios = await readEstudios();
    res.json(estudios);
});

// Obtener un estudio por ID

routerEstudios.get("/:id", async (req, res) => {
    const estudios = await readEstudios();
    const estudio = estudios.find((estudio) => estudio.id === parseInt(req.params.id));
    if (!estudio) {
        return res.status(404).json({message: "Estudio no encontrado"});
    };
    res.json(estudio);
});

// Actualizar un estudio por ID

routerEstudios.put("/:id", async (req, res) => {
    const estudios = await readEstudios();
    const estudioIndex = estudios.findIndex((estudio) => estudio.id === parseInt(req.params.id));
    if (estudioIndex === -1) {
        return res.status(404).json({message: "Estudio no encontrado"});
    }
    const updateEstudio = {
        ...estudios[estudioIndex],
        name: req.body.name
    };
    estudios[estudioIndex] = updateEstudio;
    await writeEstudios(estudios);
    res.json({message: 'Estudio updated successfully', estudio: updateEstudio}); 
    
});

// Eliminar un estudio por ID
routerEstudios.delete("/:id", async (req, res) => {
    const estudios = await readEstudios();
    const newEstudios = estudios.filter((estudio) => estudio.id !== parseInt(req.params.id));
    if (newEstudios.length === estudios.length) {
        return res.status(404).json({message: "Estudio no encontrado."});
    }
    await writeEstudios(newEstudios);
    res.json({message: "Estudio eliminado exitosamente."});
});

export default routerEstudios;