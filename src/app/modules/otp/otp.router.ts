import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { OTPController } from "./otp.controller.";

const router = Router();

router.post("/send", checkAuth(...Object.values(Role)),OTPController.sentOTP);
router.post("/verify", OTPController.verifyOTP);

export const OTPRoutes = router;
