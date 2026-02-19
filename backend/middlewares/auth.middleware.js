import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUserMiddleware = async (req, res, next) => {
  try {
    const { username, name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user)
      return res.status(400).send({
        message: "User Already Exist!",
        success: false,
      });
    if (!username || !name || !email || !password)
      return res.status(400).send({
        message: "All fields are required!",
        success: false,
      });
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const loginUserMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .send({ message: "User does not exist!", success: false });
    if (!email || !password)
      return res.status(400).send({ message: "All fields are required!!" });
    next();
  } catch (error) {
    res.status(500).send({message:"Server error", success:false})
  }
};

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized! Please login first."
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send({
        message: "Expired token.",
        success: false,
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
     console.log("===== JWT ERROR =====");
  console.log("NAME:", error.name);
  console.log("MESSAGE:", error.message);
  console.log("TOKEN:", req.cookies?.token);
  console.log("SECRET:", process.env.JWT_SECRET);
  console.log("=====================");
    return res.status(401).send({
      message: "Invalid or expired token.",
      success: false,
    });
  }
};
