import { Context, RouterContext } from "../dependencies/dependecias.ts";
import { Instructor } from "../models/InstructorModel.ts";
import { z } from "../dependencies/dependecias.ts";
const InstructorShema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email(),
  telefono: z.string().min(1),
});
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

    const validacion = InstructorShema.parse(body);
    const InstructorData = {
      id_instructor: null,
      ...validacion,
    };

    const objInstructor = new Instructor(InstructorData);
    const resultado = await objInstructor.InsertarInstructor();

    if (resultado.success) {
      response.status = 201;
      response.body = {
        success: true,
        message: "Instructor creado correctamente",
        data: resultado.instructor,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Este instructor ya existe en la base de datos: Error" +
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
export const putInstructor = async (ctx: Context) => {
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
    const validated = InstructorShema.parse(body);
    const usuarioData = {
      id_instructor: body.id_instructor,
      ...validated,
    };
    const objUsuario = new Instructor(usuarioData);
    const result = await objUsuario.EditarInstructor();

    if (result.success) {
      response.status = 200;
      response.body = {
        success: true,
        message: result.message,
        data: result.instructor,
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
export const deleteInstructor = async (
  ctx: RouterContext<"/instructor/:id">,
) => {
  const { response, params } = ctx;

  try {
    const id = params?.id;

    if (!id) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Id del instructor no fue proporcionado",
      };
      return;
    }

    const objUsuario = new Instructor();
    const result = await objUsuario.EliminarInstructor(parseInt(id));

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
