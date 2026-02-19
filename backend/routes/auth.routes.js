import express from "express"
import { registerUser,loginUser } from "../controllers/auth.controller.js";
import { registerUserMiddleware,loginUserMiddleware } from "../middlewares/auth.middleware.js";

const app = express.Router();

app.post("/register",registerUserMiddleware,registerUser)
app.post("/login",loginUserMiddleware,loginUser)

export default app;