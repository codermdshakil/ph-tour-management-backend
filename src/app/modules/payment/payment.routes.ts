import { Router } from "express";
import { paymentControllers } from "./payment.controller";


const router = Router();

router.post("/success", paymentControllers.successPayment);
router.post("/fail", paymentControllers.failPayment);
router.post("/cancel", paymentControllers.cancelPayment);



export const PaymentRoutes = router;

