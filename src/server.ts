/* eslint-disable no-console */

import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {

    await mongoose.connect(
      "mongodb+srv://fnfteam:fnfteam@fnfteam.ip63dn0.mongodb.net/tour-db"
    );
    console.log("Database Connected successfully!!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log("Error Occured", error);
  }
};

startServer();



// ## Error handle for Server gracefully shutting down!

const shutdown = (signal:string) => {
  console.log(`${signal} received. Server shutting down gracefully...`);
  
  if (server) {
    server.close(() => {
      console.log('Process terminated!');
      // সফলভাবে বন্ধ হলে exit(0), আর এরর এর কারণে হলে exit(1)
      process.exit(signal === 'uncaughtException' || signal === 'unhandledRejection' ? 1 : 0);
    });
  } else {
    process.exit(0);
  }
};


// সিগন্যাল হ্যান্ডলিং
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// এক্সেপশন হ্যান্ডলিং
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("uncaughtException");
});



process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  shutdown("unhandledRejection");
});


// unhandled rejection detected
// Promise.reject(new Error("I forget to handle this error!"));

// uncaught exception detected
// throw new Error("I forget to solved this error!");

/**
 * 3 types of error can be occured!
 *
 * - Unhandled rejection error
 * - Uncaught rejection error
 * - Signal Termination / Sigterm
 *
 */
