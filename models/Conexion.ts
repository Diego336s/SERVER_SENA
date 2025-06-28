import { Client } from "../dependencies/dependecias.ts";

export const Conexion = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "sena",
    password: ""
})