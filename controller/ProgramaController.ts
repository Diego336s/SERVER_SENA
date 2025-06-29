import { Context, RouterContext, z } from "../dependencies/dependecias.ts";
import { Programa } from "../models/ProgramaModel.ts";

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
};

export const putPrograma = async (ctx: Context) => {
};

export const deletePrograma = async (ctx: RouterContext<"/programa/:id">) => {
};
