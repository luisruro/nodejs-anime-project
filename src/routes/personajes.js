import { Router } from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const routerPersonajes = Router();
const _filename = fileURLToPath(import.meta.url);
