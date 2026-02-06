import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { DivisionControllers } from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
 

const router = Router();

router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createDivisionSchema),DivisionControllers.createDivision);
router.get("/", DivisionControllers.getAllDivisions);
router.patch("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDivisionSchema), DivisionControllers.updateDivision);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionControllers.deleteDivision);
router.get("/:id", DivisionControllers.getSingleDivision);
 
export const DivisionRoutes = router