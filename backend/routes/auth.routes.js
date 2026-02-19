import express from "express"
import { registerUser,loginUser,logoutUser } from "../controllers/auth.controller.js";
import { registerUserMiddleware,loginUserMiddleware,isLoggedIn } from "../middlewares/auth.middleware.js";

const app = express.Router();

app.post("/register",registerUserMiddleware,registerUser)
app.post("/login",loginUserMiddleware,loginUser)
app.get("/logout",isLoggedIn,logoutUser)

export default app;