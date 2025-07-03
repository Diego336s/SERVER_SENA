import { Context, RouterContext, z } from "../dependencies/dependecias.ts";
import { Aprendiz } from "../models/AprendizModel.ts";

const AprendizSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email(),
  telefono: z.string().min(1, "El teléfono es obligatorio"),
  instructor_id_instructor: z.number().int().positive("El ID del instructor debe ser un número entero positivo"),
  ficha_id_ficha: z.number().int().positive("El ID de la ficha debe ser un número entero positivo"),
});

export const getAprendiz = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const objAprendiz = new Aprendiz();
    const listaAprendiz = await objAprendiz.ListarAprendiz();

    if (!listaAprendiz || listaAprendiz.length === 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No se encontraron aprendices.",
      };
      return;
    }

    response.status = 200;
    response.body = {
      success: true,
      data: listaAprendiz,
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

export const postAprendiz = async (ctx: Context) => {
  const { response, request } = ctx;

  try {
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "El cuerpo de la solicitud está vacío",
      };
      return;
    }

    const body = await request.body.json();

    const validar = AprendizSchema.parse(body);
    const dataAprendiz = {
      id_aprendiz: null,
      ...validar,
    };
    const objAprendiz = new Aprendiz(dataAprendiz);
    const resultado = await objAprendiz.InsertarAprendiz();
    if (resultado.success) {
      response.status = 201;
      response.body = {
        success: true,
        message: "Aprendiz creado correctamente",
        data: resultado.aprendiz,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Este usuario ya existe" +
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
        message: "Error de servidor",
      };
    }
  }
};

export const putAprendiz = async (ctx: Context) => {
     const { response, request } = ctx;
   
     try {
       const contentLength = request.headers.get("Content-Length");
       if (contentLength === "0") {
         response.status = 400;
         response.body = {
           success: false,
           message: "El cuerpo de la solicitud está vacío",
         };
         return;
       }
   
       const body = await request.body.json();
   
       // validar con el esquema para actualización
       const validated = AprendizSchema.parse(body);
       const AprendizData = {
         id_aprendiz: body.id_aprendiz,
         ...validated,
       };
       const objUsuario = new Aprendiz(AprendizData);
       const result = await objUsuario.EditarAprendiz();
   
       if (result.success) {
         response.status = 200;
         response.body = {
           success: true,
           message: result.message,
           data: result.aprendiz,
         };
       } else {
         response.status = 400;
         response.body = {
           success: false,
           message: result.message,
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
           message: "Error de servidor",
         };
       }
     }
};

export const deleteAprendiz = async (ctx: RouterContext<"/aprendiz/:id">) => {
     const { response, params } = ctx;
   
     try {
       const id = params?.id;
   
       if (!id) {
         response.status = 400;
         response.body = {
           success: false,
           message: "Id del aprendiz no fue proporcionado",
         };
         return;
       }
   
       const objAprendiz = new Aprendiz();
       const result = await objAprendiz.EliminarAprendiz(parseInt(id));
   
       if (result.success) {
         response.status = 200;
         response.body = {
           success: true,
           message: result.message,
         };
       } else {
         response.status = 404;
         response.body = {
           success: true,
           message: result.message,
         };
       }
     } catch (error) {
       console.error("error del servidor", error);
       
       response.status = 500;
       response.body = {
         success: false,
         message: "Error interno del servidor al procesar la eliminación",
       };
     }   
};
