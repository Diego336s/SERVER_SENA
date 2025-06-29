import { Context, RouterContext } from "../dependencies/dependecias.ts";
import { Profesion } from "../models/ProfesionModel.ts";

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

};

export const putProfesion = async (ctx: Context) => {

};

export const deleteProfesion = async (ctx: RouterContext<"/profesion/:id">) => {

};
