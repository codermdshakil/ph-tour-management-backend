 
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import morgan from "morgan";
import passport from "passport";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import notFoundRoute from "./app/middlewares/notFoundRoute";
import { router } from "./app/routes";


const app = express();



app.use(expressSession({
  secret:"your secret",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser()); // এটি কুকি পার্স করতে সাহায্য করে

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


