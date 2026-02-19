import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import userRoute from "./routes/auth.routes.js"

dotenv.config("./.env");

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
app.use("/",userRoute)

app.get("/", function (req, res) {
  console.log("hello World!");
  res.send("Running!!");
});

app.listen(process.env.PORT, function () {
  console.log(`App is listening on port ${process.env.PORT}`);
});
