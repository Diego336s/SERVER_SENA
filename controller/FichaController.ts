
import { Context, RouterContext, z } from "../dependencies/dependecias.ts";
import { Ficha } from "../models/fichaModel.ts";

const fichaValidacion = z.object({
  codigo: z.string().min(1, "El codigo es obligatorio"),
  fecha_inicio_lectiva: z.date(),
  fecha_fin_lectiva: z.date(),
  fecha_fin_practica: z.date(),
  id_programa: z.number().int().positive(
    "El id del programa debe ser un numero positivo",
  ),
});

export const getFicha = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const objFicha = new Ficha();
    const listaFichas = await objFicha.listarFicha();
    if (!listaFichas || listaFichas.length === 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No se encontraron fichas.",
      };
      return;
    }

    response.status = 200;
    response.body = {
      success: true,
      data: listaFichas,
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

export const postFicha = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    // Verificar que la solicitud no venga vacia
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "El cuerpo de la solicitud esta vacio",
      };
      return;
    }

    // Validar el cuerpo de la solicitud
     const body = await request.body.json();
     const validacion = fichaValidacion.parse(body);
    if (!validacion.success) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Datos invalidos",
        errors: validacion.error.errors,
      };
      return;
    }

    const objFicha = new Ficha(validacion.data);
    const resultado = await objFicha.insertarFicha();
    response.status = resultado.success ? 201 : 500;
    response.body = resultado;
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

export const deleteFicha = async (ctx: RouterContext<"/ficha/:id">) => {
  const { response, params } = ctx;
  try {
    const id_ficha = parseInt(params.id_ficha || "");
    if (isNaN(id_ficha) || id_ficha <= 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "El id de la ficha es invalido",
      };
      return;
    }

    const objFicha = new Ficha();
    const resultado = await objFicha.eliminarFicha(id_ficha);
    response.status = resultado.success ? 200 : 500;
    response.body = resultado;
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

export const putFicha = async (ctx: Context) => {
  const { response, request } = ctx;
  try {
    // Validar el cuerpo de la solicitud
    const body = await request.body.json();

    // verificar que en el body venga el id_ficha
    if (!body.id_ficha || body.id_ficha == null) {
      response.status = 400;
      response.body = {
        success: false,
        message: "El id de la ficha es obligatorio y debe ser un numero",
      };
      return;
    }
    const validacion = fichaValidacion.parse(body);
    if (!validacion.success) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Datos invalidos",
        errors: validacion.error.errors,
      };
      return;
    }
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
