import { Application, oakCors } from "./dependencies/dependecias.ts";
import { InstructorRouter } from "./routes/InstructorRouter.ts";
import { aprendizRouter } from "./routes/AprendizRoutes.ts";
import { ProfesionRouter } from "./routes/ProfesionRouter.ts";
import { programaRouter } from "./routes/ProgramaRoutes.ts";
import { FichaRouter } from "./routes/FichaRoutes.ts";

const app = new Application();

app.use(oakCors()); 

const routes = [ InstructorRouter, aprendizRouter, ProfesionRouter, programaRouter, FichaRouter ];

routes.forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

console.log("Servidor corriendo en el puerto 8000");
app.listen({ port: 8000 })