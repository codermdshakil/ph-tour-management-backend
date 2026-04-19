import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { GuideControllers } from "./guide.controller";
import { createGuideZodSchema } from "./guide.validation";

const router = Router();

router.post(
  "/apply",
  checkAuth(Role.USER),
  multerUpload.single("file"),
  validateRequest(createGuideZodSchema),
  GuideControllers.applyForGuide,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideControllers.getSingleApplication,
);

router.patch(
  "/approve/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideControllers.updateGuideApplicationStatus,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideControllers.getAllGuides,
);




export const GuideRoutes = router;
