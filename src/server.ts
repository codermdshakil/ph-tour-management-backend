import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://fnfteam:fnfteam@fnfteam.ip63dn0.mongodb.net/tour-db"
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


// handle uncaught rejection
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// handle unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejection detected!! Server shutting down...", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Promise.reject(new Error("I forget to handle this error!"))



/**
 * 3 types of error can be occured!
 *
 * - Unhandled rejection error
 * - Uncaught rejection error
 * - Signal Termination / Sigterm
 *
 */
