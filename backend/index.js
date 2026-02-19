import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import userRoute from "./routes/auth.routes.js"
import connectDb from "./db/db.js";


(async () => {
  try {
    await connectDb();
    console.log("MongoDb Connected Successfully!!");
  } catch (error) {
    console.log("MongoDb Conection Failed: ", error);
  }
})();

const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/",userRoute)

app.get("/", function (req, res) {
  res.send("Running!!");
});

app.listen(process.env.PORT, function () {
  console.log(`App is listening on port ${process.env.PORT}`);
});
