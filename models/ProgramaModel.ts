import { Conexion } from "./Conexion.ts";
interface ProgramaData {
  id: number | null;
  programa: string;
}

export class Programa {
  public _objPrograma: ProgramaData | null;

  constructor(objPrograma: ProgramaData | null = null) {
    this._objPrograma = objPrograma;
  }

  public async listarProgramas(): Promise<ProgramaData[]> {
    try {
      const resultado = await Conexion.execute("SELECT * FROM programa");
      if (!resultado || !resultado.rows) {
        console.warn("La consulta no devolvio resultados");
        return [];
      }
      return resultado.rows as ProgramaData[];
    } catch (error) {
      console.error("Error al seleccionar usuarios: ", error);
      throw new Error("No se pudieron obtener datos");
    }
  }

  public async insertarPrograma(): Promise<{
    success: boolean;
    message: string;
    usuario?: Record<string, unknown>;
  }> {
    try {
      if (!this._objPrograma) {
        throw new Error("No se han proporcionado un ubjeto valido");
      }

      const { programa } = this._objPrograma;
      if (!programa) {
        throw new Error("Falta campo requerido para insertar el programa");
      }
      await Conexion.execute("START TRANSACTION");
      const resultado = await Conexion.execute(
        "INSERT INTO programa(nombre_programa) VALUES (?)",
        [
          programa,
        ],
      );
      if (
        resultado && typeof resultado.affectedRows === "number" &&
        resultado.affectedRows > 0
      ) {
        const [programa] = await Conexion.query(
          "SELECT * FROM programa WHERE id_programa = LAST_INSERT_ID()",
        );
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Programas registrado correctamente",
          usuario: programa,
        };
      } else {
        throw new Error("No se pudo registrar el programa");
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        return {
          success: false,
          message: "Error interno del servidor",
        };
      }
    }
  }
}
