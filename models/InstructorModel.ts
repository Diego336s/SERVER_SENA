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

  public async ListarInstructor(): Promise<InstructorData[]> {
    try {
      const resultado = await Conexion.execute("SELECT * FROM instructor");

      if (!resultado || !resultado.rows) {
        console.warn("La consulta no devolvio resultados");
        return [];
      }
      return resultado.rows as InstructorData[];
    } catch (error) {
      console.error("Error al seleccionar usuarios", error);
      throw new Error("No se pudieron obtener datos");
    }
  }

  public async InsertarInstructor(): Promise<
    { success: boolean; message: string; instructor?: Record<string, unknown> }
  > {
    try {
      if (!this._objInstructor) {
        throw new Error("No se proporcionó información del instructor");
      }
      const { nombre, apellido, email, telefono } = this._objInstructor;
      if (!nombre || !apellido || !apellido || !email || !telefono) {
        throw new Error("El nombre del instructor es requerido");
      }

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "INSERT INTO instructor(nombre, apellido,email,telefono) values (?, ?, ?, ?)",
        [
          nombre,
          apellido,
          email,
          telefono,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [instructor] = await Conexion.query(
          "SELECT * FROM instructor WHERE id_instructor = LAST_INSERT_ID()",
        );

        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Instructor insertado correctamente",
          instructor: instructor,
        };
      } else {
        throw new Error("No se pudo insertar el instructor");
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: true,
          message: error.message,
        };
      } else {
        return {
          success: true,
          message: "Error interno del servidor",
        };
      }
    }
  }
}
