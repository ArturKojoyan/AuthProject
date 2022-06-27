import express from "express"
import mongoose from "mongoose"
import Authrouter from "./Authrouter.js"

const app = express();
const URL = `mongodb+srv://Artur:11111@cluster0.omquq.mongodb.net/auth_roles?retryWrites=true&w=majority`

app.use(express.json());
app.use("/auth",Authrouter);

const start = async () =>{
  try {
      await mongoose.connect(URL);

      app.listen(8080,() => console.log("server is working"));

  } catch (e) {
      console.log(e);
  }
 
}

start();