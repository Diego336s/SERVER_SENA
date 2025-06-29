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
      const validated = profesionShema.parse(body);
      const profesionData = {
        id_profesion: body.id_profesion,
        ...validated,
      };
      const objProfesion = new Profesion(profesionData);
      const result = await objProfesion.EditarProfesion();
  
      if (result.success) {
        response.status = 200;
        response.body = {
          success: true,
          message: result.message,
          data: result.profesion,
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

export const deleteProfesion = async (ctx: RouterContext<"/profesion/:id">) => {
    const { response, params } = ctx;
  
    try {
      const id = params?.id;
  
      if (!id) {
        response.status = 400;
        response.body = {
          success: false,
          message: "Id de la profesion no fue proporcionado",
        };
        return;
      }
  
      const objUsuario = new Profesion();
      const result = await objUsuario.EliminarProfesion(parseInt(id));
  
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
