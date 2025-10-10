import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import path from "path";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import modulesRoutes from "./app/routes";

import morgan from "morgan";

const app: Application = express();

// log the request
app.use(morgan("dev"));
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3010",
      "https://tiredashfleet.nahid-mahmud.xyz",
      "https://tiresdash.com",
      "https://fleet.tiresdash.com",
      "https://tiresdash-client.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/storage", express.static(path.join(__dirname, "../public/storage")));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/api/v1", modulesRoutes);

//global error handler
app.use(globalErrorHandler);

// handle api not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API not found",
      },
    ],
  });
  next();
});

export default app;
