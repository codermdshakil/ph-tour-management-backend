import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;


const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://fnfteam:fnfteam@fnfteam.ip63dn0.mongodb.net/tour-management-backend"
    );
    console.log("Database Connected successfully!!");

    server = app.listen(5000, () => {
      console.log("Server running on port 5000!");
    });
  } catch (error) {
    console.log("Error Occured", error);
  }
};


startServer();

/**
 * 3 types of error can be occured!
 * 
 * - Unhandled rejection error
 * - Uncaught rejection error 
 * - Signal Termination / Sigterm
 * 
 * 
*/

