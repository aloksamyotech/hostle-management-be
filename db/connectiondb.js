import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const url = process.env.DB_URL;

const connect =  mongoose.connect(url).then(()=>{
console.log("Database Connected Successfully!!");
}).catch((err)=> {
console.log('error while connection',err)
});

export default connect;
