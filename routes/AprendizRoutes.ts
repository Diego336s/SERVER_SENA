import { Router } from "../dependencies/dependecias.ts";
import { getAprendiz, postAprendiz, putAprendiz, deleteAprendiz } from "../controller/AprendizController.ts";


const aprendizRouter = new Router();

aprendizRouter.get("/aprendiz", getAprendiz);
aprendizRouter.post("/aprendiz", postAprendiz);
aprendizRouter.put("/aprendiz", putAprendiz);
aprendizRouter.delete("/aprendiz/:id", deleteAprendiz);

export {aprendizRouter};