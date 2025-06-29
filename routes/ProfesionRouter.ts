import { Router } from "../dependencies/dependecias.ts";
import { getProfesion, postProfesion, putProfesion, deleteProfesion } from "../controller/ProfesionController.ts";

const ProfesionRouter = new Router();
ProfesionRouter.get("/profesion", getProfesion);
ProfesionRouter.post("/profesion", postProfesion);  
ProfesionRouter.put("/profesion", putProfesion);
ProfesionRouter.delete("/profesion/:id", deleteProfesion);

export { ProfesionRouter };
