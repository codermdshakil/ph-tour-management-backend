import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";

const router = Router();

router.post("/create", validateRequest(createTourZodSchema), checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.createTour)
router.get("/", TourControllers.getAllTours);
router.get("/:id", TourControllers.getSingleTour);
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    TourControllers.updateTour
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.deleteTour);




export const TourRoutes = router;
