"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://fnfteam:fnfteam@fnfteam.ip63dn0.mongodb.net/tour-db");
        console.log("Database Connected successfully!!");
        server = app_1.default.listen(5000, () => {
            console.log("Server running on port 5000!");
        });
    }
    catch (error) {
        console.log("Error Occured", error);
    }
});
startServer();
// ## Error handle for Server gracefully shutting down!
const shutdown = (signal) => {
    console.log(`${signal} received. Server shutting down gracefully...`);
    if (server) {
        server.close(() => {
            console.log('Process terminated!');
            // সফলভাবে বন্ধ হলে exit(0), আর এরর এর কারণে হলে exit(1)
            process.exit(signal === 'uncaughtException' || signal === 'unhandledRejection' ? 1 : 0);
        });
    }
    else {
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
