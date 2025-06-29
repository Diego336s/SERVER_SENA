import { Router } from "../dependencies/dependecias.ts";
import { getPrograma, postPrograma, putPrograma, deletePrograma } from "../controller/ProgramaController.ts";

const programaRouter = new Router();
programaRouter.get("/programa", getPrograma);
programaRouter.post("/programa", postPrograma);
programaRouter.put("/programa", putPrograma);
programaRouter.delete("/programa/:id", deletePrograma);

export {programaRouter};