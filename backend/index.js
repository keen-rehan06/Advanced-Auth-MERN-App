import express from "express";
import dotenv from "dotenv"

dotenv.config("./.env");

const app = express();

app.use(express.json({}));
app.use(express.urlencoded({extended:true}));


app.get("/",function(req,res){
    console.log("hello World!")
    res.send("Running!!")
})

app.listen(process.env.PORT,function(){
    console.log(`App is listening on port ${process.env.PORT}`)
})