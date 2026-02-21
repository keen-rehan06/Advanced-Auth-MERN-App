import express from "express"
import { registerUser,loginUser,logoutUser,verification } from "../controllers/auth.controller.js";
import { registerUserMiddleware,loginUserMiddleware,isLoggedIn } from "../middlewares/auth.middleware.js";

const app = express.Router();

app.post("/register",registerUserMiddleware,registerUser)
app.post("/verify",verification)
app.post("/login",loginUserMiddleware,loginUser)
app.post("/logout",isLoggedIn,logoutUser)

export default app;