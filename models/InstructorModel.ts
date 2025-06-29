import { Conexion } from "./Conexion.ts";

interface InstructorData {
    id_instructor: number | null;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
}

export class Instructor {
    public _objInstructor: InstructorData | null;

    constructor(objInstructor: InstructorData | null = null) {
        this._objInstructor = objInstructor;
    }

    public async ListarInstructor(): Promise<InstructorData[]>{
        try {
            const resultado = await Conexion.execute("SELECT * FROM instructor");

            if (!resultado || !resultado.rows) {
                console.warn("La consulta no devolvio resultados");
                return []
            }
            return resultado.rows as InstructorData[];
        } catch (error) {
            console.error("Error al seleccionar usuarios", error);
            throw new Error("No se pudieron obtener datos");
        }
    }

}