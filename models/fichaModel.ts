import { Conexion } from "./Conexion.ts";

interface FichaData {
  id_ficha: number | null;
  codigo: string;
  fecha_inicio_lectiva: Date;
  fecha_fin_lectiva: Date;
  fecha_fin_practica: Date;
  id_programa: number;
}

export class Ficha {
  public _objFicha: FichaData | null;

  constructor(objPrograma: FichaData | null = null) {
    this._objFicha = objPrograma;
  }

  

  
  public async listarFicha(): Promise<FichaData[]>{
    try {
      const resultado = await Conexion.execute("SELECT * FROM ficha");
      if(!resultado || !resultado.rows) {
        console.warn("La consulta no devolvio resultados");
        return [];
      }
      return resultado.rows as FichaData[];
      
    } catch (error) {
      console.error("Error al seleccionar fichas: ", error);
      throw new Error("No se pudieron obtener datos");      
    }
  }

  public async insertarFicha(): Promise<{
    success: boolean;
    message: string;
    ficha?: Record<string, unknown>;
  }> {
    try {
      if (!this._objFicha) {
        throw new Error("No se han proporcionado un objeto valido");
      }

      const { codigo, fecha_inicio_lectiva, fecha_fin_lectiva, fecha_fin_practica, id_programa } = this._objFicha;
      if (!codigo || !fecha_inicio_lectiva || !fecha_fin_lectiva || !fecha_fin_practica || !id_programa) {
        throw new Error("Falta campo requerido para insertar la ficha");
      }
      await Conexion.execute("START TRANSACTION");
      const resultado = await Conexion.execute(
        "INSERT INTO ficha(codigo, fecha_inicio_lectiva, fecha_fin_lectiva, fecha_fin_practica, id_programa) VALUES (?, ?, ?, ?, ?)",
        [
          codigo,
          fecha_inicio_lectiva,
          fecha_fin_lectiva,
          fecha_fin_practica,
          id_programa,
        ],
      );
      if (resultado && typeof resultado.affectedRows === "number" && resultado.affectedRows > 0) {
        const [ficha] = await Conexion.query(
          "SELECT * FROM ficha WHERE id_ficha = LAST_INSERT_ID()",
        );
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Ficha registrada correctamente",
          ficha: ficha,
        };
      } else {
        throw new Error("No se pudo registrar la ficha");
      }
    } catch (error) {
      console.error("Error al insertar la ficha: ", error);
      await Conexion.execute("ROLLBACK");
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al insertar la ficha",
      };
    }
  }

  public async eliminarFicha(id_ficha: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      if (!id_ficha) {
        throw new Error("No se ha proporcionado un id_ficha valido");
      }
      await Conexion.execute("START TRANSACTION");
      const resultado = await Conexion.execute(
        "DELETE FROM ficha WHERE id_ficha = ?",
        [id_ficha],
      );
      if (resultado && typeof resultado.affectedRows === "number" && resultado.affectedRows > 0) {
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Ficha eliminada correctamente",
        };
      } else {
        throw new Error("No se pudo eliminar la ficha");
      }
    } catch (error) {
      console.error("Error al eliminar la ficha: ", error);
      await Conexion.execute("ROLLBACK");
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al eliminar la ficha",
      };
    }
  }

  public async editarFicha(): Promise<{
    success: boolean;
    message: string;
    ficha?: Record<string, unknown>;
  }> {
    try {
      if (!this._objFicha) {
        throw new Error("No se han proporcionado un objeto valido");
      }

      const { id_ficha, codigo, fecha_inicio_lectiva, fecha_fin_lectiva, fecha_fin_practica, id_programa } = this._objFicha;
      if (!id_ficha || !codigo || !fecha_inicio_lectiva || !fecha_fin_lectiva || !fecha_fin_practica || !id_programa) {
        throw new Error("Falta campo requerido para editar la ficha");
      }
      await Conexion.execute("START TRANSACTION");
      const resultado = await Conexion.execute(
        "UPDATE ficha SET codigo = ?, fecha_inicio_lectiva = ?, fecha_fin_lectiva = ?, fecha_fin_practica = ?, id_programa = ? WHERE id_ficha = ?",
        [
          codigo,
          fecha_inicio_lectiva,
          fecha_fin_lectiva,
          fecha_fin_practica,
          id_programa,
          id_ficha,
        ],
      );
      if (resultado && typeof resultado.affectedRows === "number" && resultado.affectedRows > 0) {
        const [ficha] = await Conexion.query(
          "SELECT * FROM ficha WHERE id_ficha = ?",
          [id_ficha],
        );
        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Ficha editada correctamente",
          ficha: ficha,
        };
      } else {
        throw new Error("No se pudo editar la ficha");
      }
    } catch (error) {
      console.error("Error al editar la ficha: ", error);
      await Conexion.execute("ROLLBACK");
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido al editar la ficha",
      };
    }
  }


}
