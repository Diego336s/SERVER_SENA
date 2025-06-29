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

  public async EditarProfesion(): Promise<
    { success: boolean; message: string; profesion?: Record<string, unknown> }
  > {
    try {
      if (!this._objProfesion) {
        throw new Error("No se ha proporcionado un objeto valido");
      }

      const { id_profesion, nombre_profesion } = this._objProfesion;
      if (!id_profesion || !nombre_profesion) {
        throw new Error("Faltan campos requeridos para editar la profesion");
      }

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "UPDATE profesion SET nombre_profesion = ?WHERE id_profesion = ?",
        [
          nombre_profesion,
          id_profesion,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [profesion] = await Conexion.query(
          "SELECT * FROM profesion WHERE id_profesion = ?",
          [id_profesion],
        );

        //Confirmar transaccion
        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Profesion Editada Correctamente",
          profesion: profesion,
        };
      } else {
        throw new Error("No se pudo insertar la profesion");
      }
    } catch (error) {
      //Rollback en caso de error
      await Conexion.execute("ROLLBACK");

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

  public async EliminarProfesion(
    id_profesion: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "DELETE FROM profesion WHERE id_profesion = ?",
        [
          id_profesion,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Profesion eliminada correctamente.",
        };
      } else {
        await Conexion.execute("ROLLBACK");
        return {
          success: false,
          message:
            "No se encontró la profesion con el ID proporcionado o no se pudo eliminar.",
        };
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      if (error instanceof Error) {
        return {
          success: false,
          message: "Error al eliminar profesion: " + error.message,
        };
      } else {
        return {
          success: false,
          message: "Error interno del servidor al eliminar profesion.",
        };
      }
    }
  }
}
