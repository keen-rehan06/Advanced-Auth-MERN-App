import userModel from "../models/user.model.js";

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
