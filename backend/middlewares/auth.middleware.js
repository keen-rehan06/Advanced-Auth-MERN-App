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
    if(user.isVerified !== true) return res.status(402).send({message:"Verify your account than login",success:false});
    next();
  } catch (error) {
    res.status(500).send({message:"Server error", success:false})
  }
};

export const isLoggedIn = async (req, res, next) => {
  let token;

  // 1️⃣ Check cookie
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // 2️⃣ Check Authorization header
  else if (req.headers.authorization &&
           req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


