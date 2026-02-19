import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateToken from "../config/jwtToken.js";
import { verifyEmail } from "../verifyEmail/verifyEmail.js";
import jwt from "jsonwebtoken"

export const registerUser = async(req,res)  => {
   try {
    const {name,username,email,password} = req.body
    const hash = await bcrypt.hash(password,10)
    const user = await userModel.create({
      name,
      username,
      email,
      password:hash
    })
    const token = generateToken(user)
    verifyEmail(token,email)
    user.token = token
    await user.save()
    const newCreatedUser = await userModel.findById(user._id).select("-password -token");
    res.cookie("token",token);
    console.log(user);
    res.status(201).send({message:"user created successfully!",success:true,data:newCreatedUser})
   } catch (error) {
    res.status(500).send({message:"Server error:",error})
   }    
}
 
export const verification = async (req,res) => {
 
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

  }

export const loginUser = async(req,res)  => {
  try {
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    const newUser = await userModel.findById(user._id).select("-password");
    bcrypt.compare(password,user.password,function(err,result){
      if(err) return res.status(400).send("Something went wrong!!")
      if(!result) return res.status(401).send({message:"Password is incorrect!",success:false})
      const token = generateToken(user)
      res.cookie("token",token);
      res.status(201).send({message:"User loggedIn Successfully!!",success:true,data:newUser})
    })

  } catch (error) {
    res.status(500).send({message:"Server error:",error}) 
  }
}
export const logoutUser = async(req,res)  => {
 try {
   res.clearCookie("token")
   res.status(200).send({message:"User Logout Successfully!!",success:true})
 } catch (error) {
  res.status(500).send({message:"Server Error:",error})
 }
}