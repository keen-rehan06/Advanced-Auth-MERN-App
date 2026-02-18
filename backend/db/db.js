import mongoose from "mongoose";

const connectDb = async () => {
    try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
} catch (error) {
    console.log('MongoDb conection failed: ',error)
}
}

export default connectDb;