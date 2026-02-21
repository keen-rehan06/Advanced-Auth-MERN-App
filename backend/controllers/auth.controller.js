import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwtToken.js";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
import { AccessToken, RefreshToken } from "../config/AccessRefreshToken.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      username,
      email,
      password: hash,
    });
    const token = generateToken(user);
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    const newCreatedUser = await userModel
      .findById(user._id)
      .select("-password -token");
    res.cookie("token", token);
    console.log(user);
    res
      .status(201)
      .send({
        message: "user created successfully!",
        success: true,
        data: newCreatedUser,
      });
  } catch (error) {
    res.status(500).send({ message: "Server error:", error });
  }
};
export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token is missing or invalid",
        success: false,
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded:", decoded);
    } catch (error) {
      console.log("JWT ERROR NAME:", error.name);
      console.log("JWT ERROR MESSAGE:", error.message);
      return res.status(400).json({
        message: error.message,
        success: false,
      });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.token = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const newUser = await userModel.findById(user._id).select("-password");
    const result = await bcrypt.compare(password, user.password);

    if (!result)
      return res
        .status(401)
        .send({ message: "Password is incorrect!", success: false });
    const token = generateToken(user);
    res.cookie("token", token);

    const existingSession = await sessionModel.findOne({ userId: user._id });
    if (existingSession) {
      await sessionModel.deleteOne({ userId: user._id });
    }
    await sessionModel.create({ userId: user._id });

    const accessToken = AccessToken(user);
    const refreshToken = RefreshToken(user);
    console.log("AccessToken", accessToken);
    user.isLoggedin = true;
    await user.save();

    res
      .status(201)
      .send({
        message: `Welcome Back ${user.name}!`,
        success: true,
        data: newUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    res.status(500).send({ message: "Server error:", error });
  }
};
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await sessionModel.deleteMany({ userId });
    await userModel.findByIdAndUpdate(userId, { isLoggedin: false });
    res.clearCookie("token");
    res
      .status(200)
      .send({ message: "User Logout Successfully!!", success: true });
  } catch (error) {
    res.status(500).send({ message: "Server Error:", error });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(401)
        .send({ message: "User not found", success: false });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now()+10*60*1000)
    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save()
    res.status(200).send({success:true,message:"Otp Sent successfully!!"})
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};
