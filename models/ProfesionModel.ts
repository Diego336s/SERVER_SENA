import { Conexion } from "./Conexion.ts";

interface ProfesionData {
  id_profesion: number | null;
  nombre_profesion: string;
}

export class Profesion {
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

  public async InsertarProfesion(): Promise<
    { success: boolean; message: string; profesion?: Record<string, unknown> }
  > {
    try {
      if (!this._objProfesion) {
        throw new Error("No se proporcionó información de la profesión");
      }
      const { nombre_profesion } = this._objProfesion;
      if (!nombre_profesion) {
        throw new Error("El nombre de la profesión es requerido");
      }

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "INSERT INTO profesion(nombre_profesion) values (?)",
        [
          nombre_profesion,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [profesion] = await Conexion.query(
          "SELECT * FROM profesion WHERE id_profesion = LAST_INSERT_ID()",
        );

        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Profesion insertada correctamente",
          profesion: profesion,
        };
      } else {
        throw new Error("No se pudo insertar la profesion");
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
