import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DivisionControllers } from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
 

const router = Router();

router.post("/create", validateRequest(createDivisionSchema),DivisionControllers.createDivision);
router.patch("/:id", validateRequest(updateDivisionSchema), DivisionControllers.updateDivision);
router.delete("/:id", DivisionControllers.deleteDivision);
router.get("/:id", DivisionControllers.getSingleDivision);
 
export const DivisionRoutes = router