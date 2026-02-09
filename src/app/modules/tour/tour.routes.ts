import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";

const router = Router();


// TourType start here 

router.post("/create-tour-type", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),validateRequest(createTourTypeZodSchema), TourControllers.createTourType);
router.patch("/tour-types/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.updateTourType);
router.get("/tour-types", TourControllers.getAllTourType);
router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.deleteTourType);




// Tour routes start here 

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
