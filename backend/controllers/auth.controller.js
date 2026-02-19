import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateToken from "../config/jwtToken.js";

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
    const newCreatedUser = await userModel.findById(user._id).select("-password");
    const token = generateToken(user)
    res.cookie("token",token);
    res.status(201).send({message:"user created successfully!",success:true,data:newCreatedUser})
   } catch (error) {
    res.status(500).send({message:"Server error:",error})
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

export const logoutUser = async(req,res)  => {}