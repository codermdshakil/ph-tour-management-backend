import { Router } from "express";
import { paymentControllers } from "./payment.controller";


const router = Router();

router.post("/success", paymentControllers.successPayment);
router.post("/fail", paymentControllers.successPayment);
router.post("/cancel", paymentControllers.successPayment);



export const PaymentRoutes = router;

