 
import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import { router } from "./app/routes";

const app = express();


app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use("/api/v1", router);

app.get("/",(req:Request, res:Response) => {
  res.status(200).json({
    message:"Welcome to Ph Tour Management system Backend!"
  })
});


// Not Found Route handle
app.use(notFoundRoute)

// Global Error handler
app.use(globalErrorHandler)


export default app;


