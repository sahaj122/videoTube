import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
  path: './env'
})

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server is running at PORT : ${process.env.PORT}`);
  })
})
.catch((err)=>{
  console.log("Mongo DB connection failed !!!",err);
})
/*

  // import mongoose from "mongoose";
  // import { DB_NAME } from "./constants";


  ( async ()=>{
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

      app.on("error", (error)=>{
        console.log("ERRR: ", error);
        throw error
      })

      app.listen(process.env.PORT, ()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
      })
    }
    catch(error){
      console.error("Error: ", error)
      throw error
    }
  })()

*/