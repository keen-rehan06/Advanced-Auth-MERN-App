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
  let token;

  // 1️⃣ Check token in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2️⃣ Check token in Authorization header if not found in cookies
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;

    // Check if it starts with Bearer
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  // 3️⃣ If still no token
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized! Please login first."
    });
  }

  // 4️⃣ Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(401).send({
      success: false,
      message: "Expired token."
    });
  }

  req.user = decoded;
  next();

} catch (error) {
  return res.status(401).send({
    success: false,
    message: "Invalid or expired token."
  });
}

};

export const isVerificationMiddleware = async (req,res,next) => {
  try {
  const authHeader = req.header.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({
      message:"Authorization token is missing or invalid",
      success:false,
    })
  }
    const token = authHeader.split(" ")[1]; 
    let decoded;
    try {
      decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).send({
          message:"The registration token has expired",
          success:false
        })
      } 
      return res.status(400).send({message:"Token verification failed!",success:false
      })
    }
    next()
  } catch (error) {
     return res.status(401).send({
    success: false,
    message: "something Went wrong!",
    data:error
  });
  }
}