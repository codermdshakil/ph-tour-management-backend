import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DivisionControllers } from "./division.controller";
import { createDivisionZodSchema } from "./division.validation";

const router = Router();

router.post("/create",validateRequest(createDivisionZodSchema), DivisionControllers.createDivision);
router.get("/", DivisionControllers.getAllDivisions);
router.patch("/:id",DivisionControllers.updateDivision);


export const DivisionRoutes = router;
