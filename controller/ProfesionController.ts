import { Context, RouterContext } from "../dependencies/dependecias.ts";
import { Profesion } from "../models/ProfesionModel.ts";
import { z } from "../dependencies/dependecias.ts";

const profesionShema = z.object({
  nombre_profesion: z.string().min(1, "El nombre es obligatorio"),
});

export const getProfesion = async (ctx: Context) => {
  const { response } = ctx;

  try {
    const objProfesion = new Profesion();
    const listaProfesion = await objProfesion.ListarProfesion();

    if (!listaProfesion || listaProfesion.length === 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No se encontraron profesiones.",
      };
      return;
    }

    response.status = 200;
    response.body = {
      success: true,
      data: listaProfesion,
    };
  } catch (error) {
    if (error instanceof Error) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Error de validación",
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

export const postProfesion = async (ctx: Context) => {
  const { response, request } = ctx;

  try {
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "El cuerpo de la solicitud esta vacio",
      };
      return;
    }

    const body = await request.body.json();

    const validacion = profesionShema.parse(body);
    const ProfesionData = {
      id_profesion: null,
      ...validacion,
    };

    const objProfesion = new Profesion(ProfesionData);
    const resultado = await objProfesion.InsertarProfesion();

    if (resultado.success) {
      response.status = 201;
      response.body = {
        success: true,
        message: "Profesion creada correctamente",
        data: resultado.profesion,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Esta profesion ya existe en la base de datos: Error" +
          resultado.message,
      };
    }
  }catch (error) {
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
        message: "Error de servidor",
      };
    }
  }
};

export const putProfesion = async (ctx: Context) => {
};

export const deleteProfesion = async (ctx: RouterContext<"/profesion/:id">) => {
};
