import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { DivisionControllers } from "./division.controller";
import { createDivisionZodSchema } from "./division.validation";

const router = Router();

router.post("/create",validateRequest(createDivisionZodSchema), DivisionControllers.createDivision)

export const DivisionRoutes = router;
