import { Conexion } from "./Conexion.ts";

interface ProfesionData {
    id_profesion: number | null;
    nombre_profesion: string;
}

export class Profesion{
    public _objProfesion: ProfesionData | null;

    constructor(objProfesion: ProfesionData | null = null) {
        this._objProfesion = objProfesion;
    }

    public async ListarProfesion(): Promise<ProfesionData[]> {
        try {
            const resultado = await Conexion.execute("SELECT * FROM profesion");

            if (!resultado || !resultado.rows) {
                console.warn("La consulta no devolvió resultados");
                return [];
            }
            return resultado.rows as ProfesionData[];
        } catch (error) {
            console.error("Error al seleccionar profesiones", error);
            throw new Error("No se pudieron obtener datos");
        }
    }
}