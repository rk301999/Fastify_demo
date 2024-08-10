import mongoose from "mongoose"

export const connectDB = async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}`,{
            dbName:"fastifyDB"
        })
        console.log("database connected");
    }
    catch(error){
        throw(error);
    }
}