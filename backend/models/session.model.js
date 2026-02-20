import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
})

const sessionModel = new mongoose.model("session",sessionSchema);

export default sessionModel;