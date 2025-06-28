import { Router } from "../dependencies/dependecias.ts";
import { getInstructor } from "../controller/InstructorController.ts";

const InstructorRouter = new Router();

InstructorRouter.get("/instructor", getInstructor);
InstructorRouter.post("/instructor", getInstructor);
InstructorRouter.put("/instructor", getInstructor);
InstructorRouter.delete("/instructor", getInstructor);

export { InstructorRouter };