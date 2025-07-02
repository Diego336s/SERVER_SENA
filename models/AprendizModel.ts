import { Conexion } from "./Conexion.ts";

interface AprendizData {
  id_aprendiz: number | null;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export class Aprendiz {
  public _objAprendiz: AprendizData | null;

  constructor(objAprendiz: AprendizData | null = null) {
    this._objAprendiz = objAprendiz;
  }

  public async ListarAprendiz(): Promise<AprendizData[]> {
    try {
      const resultado = await Conexion.execute("SELECT * FROM aprendiz");

      if (!resultado || !resultado.rows) {
        console.warn("La consulta no devolvió resultados");
        return [];
      }
      return resultado.rows as AprendizData[];
    } catch (error) {
      console.error("Error al seleccionar aprendices", error);
      throw new Error("No se pudieron obtener datos");
    }
  }

  public async InsertarAprendiz(): Promise<
    { success: boolean; message: string; aprendiz?: Record<string, unknown> }
  > {
    try {
      if (!this._objAprendiz) {
        throw new Error("No se proporcionó información del aprendiz");
      }
      const { nombre, apellido, email, telefono } = this._objAprendiz;
      if (!nombre || !apellido || !email || !telefono) {
        throw new Error("El nombre del aprendiz es requerido");
      }

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "INSERT INTO aprendiz(nombre, apellido, email, telefono) values (?, ?, ?, ?)",
        [nombre, apellido, email, telefono],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [aprendiz] = await Conexion.query(
          "SELECT * FROM aprendiz WHERE id_aprendiz = LAST_INSERT_ID()",
        );

        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Aprendiz insertado correctamente",
          aprendiz: aprendiz,
        };
      } else {
        throw new Error("No se pudo insertar el aprendiz");
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

  public async EditarAprendiz(): Promise<
    { success: boolean; message: string; aprendiz?: Record<string, unknown> }
  > {
    try {
      if (!this._objAprendiz) {
        throw new Error("No se ha proporcionado un objeto valido");
      }

      const { id_aprendiz, nombre, apellido, email, telefono } =
        this._objAprendiz;
      if (!id_aprendiz || !nombre || !apellido || !email || !telefono) {
        throw new Error("Faltan campos requeridos para editar el aprendiz");
      }

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "UPDATE aprendiz SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id_aprendiz = ?",
        [
          nombre,
          apellido,
          email,
          telefono,
          id_aprendiz,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [aprendiz] = await Conexion.query(
          "SELECT * FROM aprendiz WHERE id_aprendiz = ?",
          [id_aprendiz],
        );

        //Confirmar transaccion
        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Aprendiz Editado Correctamente",
          aprendiz: aprendiz,
        };
      } else {
        throw new Error("No se pudo insertar el aprendiz");
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

  public async EliminarAprendiz(
    id_aprendiz: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "DELETE FROM aprendiz WHERE id_aprendiz = ?",
        [
          id_aprendiz,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Aprendiz eliminado correctamente.",
        };
      } else {
        await Conexion.execute("ROLLBACK");
        return {
          success: false,
          message:
            "No se encontró el aprendiz con el ID proporcionado o no se pudo eliminar.",
        };
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      if (error instanceof Error) {
        return {
          success: false,
          message: "Error al eliminar aprendiz: " + error.message,
        };
      } else {
        return {
          success: false,
          message: "Error interno del servidor al eliminar aprendiz.",
        };
      }
    }
  }
}
