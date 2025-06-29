import { Context, RouterContext } from "../dependencies/dependecias.ts";
import { Instructor } from "../models/InstructorModel.ts";

export const getInstructor = async (ctx: Context) => {
    const { response } = ctx;

    try {
        const objInstructor = new Instructor();
        const listaInstructor = await objInstructor.ListarInstructor();

        if (!listaInstructor || listaInstructor.length === 0) {
            response.status = 400;
            response.body = {
                success: false,
                message: "No se encontraron Instructores. ",
            };
            return;
        }

        response.status = 200;
        response.body = {
            success: true,
            data: listaInstructor,
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
export const postInstructor = async (ctx: Context) => {

};
export const putInstructor = async (ctx: Context) => {

};
export const deleteInstructor = async (ctx: RouterContext<"/instructor/:id">) => {

};