import { Router } from "express";
import { validateRequest } from "../../utils/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validate";

const router = Router();


router.post("/register", validateRequest(createUserZodSchema),UserControllers.createUser);

router.get("/all-users", UserControllers.getAllUsers);

export const UserRoutes = router;
