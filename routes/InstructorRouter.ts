import { Router } from "../dependencies/dependecias.ts";
import { getInstructor, postInstructor, putInstructor, deleteInstructor } from "../controller/InstructorController.ts";

const InstructorRouter = new Router();

InstructorRouter.get("/instructor", getInstructor);
InstructorRouter.post("/instructor", postInstructor);
InstructorRouter.put("/instructor", putInstructor);
InstructorRouter.delete("/instructor/:id", deleteInstructor);

export { InstructorRouter };