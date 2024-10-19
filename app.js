import express from "express";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRoutes.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
dotenv.config()

// cookieparser used for getting token and authorization
app.use(cookieParser());

// express json converts string into json
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

dbConnection();

app.use(errorMiddleware)

export default app; 