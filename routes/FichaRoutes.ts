import { Router } from "../dependencies/dependecias.ts";
import { getFicha, postFicha, putFicha, deleteFicha } from "../controller/AprendizController.ts";


const FichaRouter = new Router();

FichaRouter.get("/ficha", getFicha);
FichaRouter.post("/ficha", postFicha);
FichaRouter.put("/ficha", putFicha);
FichaRouter.delete("/ficha/:id", deleteFicha);

export {FichaRouter};