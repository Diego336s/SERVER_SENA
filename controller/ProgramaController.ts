import { errors } from "https://deno.land/x/oak@v17.1.4/deps.ts";
import { Context, RouterContext, z } from "../dependencies/dependecias.ts";
import { Programa } from "../models/ProgramaModel.ts";

const programaValidacion = z.object({
  programa: z.string().min(1, "El nombre es obligatorio"),
});

export const getPrograma = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const objPrograma = new Programa();
    const listaProgramas = await objPrograma.listarProgramas();
    if (!listaProgramas || listaProgramas.length === 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No se encontraron programas.",
      };
      return;
    }

    response.status = 200;
    response.body = {
      success: true,
      data: listaProgramas,
    };
  } catch (error) {
    if (error instanceof Error) {
      response.status = 500;
      response.body = {
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        message: "Error interno del servidor",
        error: String(error),
      };
    }
  }
};

export const postPrograma = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    //Verificar que la solicitud no venga vacia
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "El cuerpo de la solicitud esta vacio",
      };
      return;
    }

    //Traer el body
    const body = await request.body.json();

    //Validar el cuerpo
    const validated = programaValidacion.parse(body);
    const programaDate = {
      id: null,
      ...validated,
    };

    const objPrograma = new Programa(programaDate);
    const resultado = await objPrograma.insertarPrograma();

    if (resultado.success) {
      response.status = 201;
      response.body = {
        success: true,
        message: "Programas creado correctamente",
        data: resultado.usuario,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Este programa ya existe en la base de datos: Error " +
          resultado.message,
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Datos invalidos",
        errors: error.format(),
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        messsage: "Error interno del servidor",
      };
    }
  }
};

export const putPrograma = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    //Verificar que la solicitud no venga vacia
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "El cuerpo de la solicitud esta vacio",
      };
      return;
    }

    //Traer el body
    const body = await request.body.json();

    //validar que el body tenga el id
    if (!body.id || body.id == null) {
      response.status = 400;
      response.body = {
        success: false,
        message: "El id del programa es obligatorio",
      };
      return;
    }

    //Validar el cuerpo
    const validated = programaValidacion.parse(body);
    const programaDate = {
      id: body.id,
      ...validated,
    };

    const objPrograma = new Programa(programaDate);
    const resultado = await objPrograma.editarPrograma();

    if (resultado.success) {
      response.status = 201;
      response.body = {
        success: true,
        message: "Programa Editado correctamente",
        data: resultado.usuario,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Error al actualizar el programa: " + resultado.message,
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Datos invalidos",
        errors: error.format(),
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        messsage: "Error interno del servidor",
      };
    }
  }
};

export const deletePrograma = async (ctx: RouterContext<"/programa/:id">) => {
};
