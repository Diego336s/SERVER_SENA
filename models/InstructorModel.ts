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

  public async EditarInstructor(): Promise<{ success: boolean; message: string; instructor?: Record<string, unknown> }> {
    try {
      if (!this._objInstructor) {
        throw new Error("No se ha proporcionado un objeto valido");
      }

      const { id_instructor, nombre, apellido, email, telefono } =
        this._objInstructor;
      if (!id_instructor  || !nombre || !apellido || !email || !telefono) {
        throw new Error("Faltan campos requeridos para editar el instructor");
      }

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute(
        "UPDATE instructor SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id_instructor = ?",
        [
          nombre,
          apellido,
          email,
          telefono,
          id_instructor,
        ],
      );

      if (
        result && typeof result.affectedRows === "number" &&
        result.affectedRows > 0
      ) {
        const [instructor] = await Conexion.query(
          "SELECT * FROM instructor WHERE id_instructor = ?",
          [id_instructor],
        );

        //Confirmar transaccion
        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Instructor Editado Correctamente",
          instructor: instructor,
        };
      } else {
        throw new Error("No se pudo insertar el instructor");
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

    public async EliminarInstructor(id_instructor: number): Promise<{ success: boolean; message: string }> {
    try {

      await Conexion.execute("START TRANSACTION");

      const result = await Conexion.execute("DELETE FROM instructor WHERE id_instructor = ?",
        [
            id_instructor
        ],
      );

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Instructor eliminado correctamente.",
        };
      } else {
        await Conexion.execute("ROLLBACK");
        return {
          success: false,
          message: "No se encontró el instructor con el ID proporcionado o no se pudo eliminar.",
        };
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      if (error instanceof Error) {
        return {
          success: false,
          message: "Error al eliminar instructor: " + error.message,
        };
      } else {
        return {
          success: false,
          message: "Error interno del servidor al eliminar instructor.",
        };
      }
    }
  }
}
