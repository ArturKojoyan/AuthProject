import User from "./models/User.js"
import Role from "./models/Role.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import {validationResult} from "express-validator"


const generateAccessToken = (id,roles) => {
  const payload = {
     id,
     roles
  }

  return jwt.sign(payload,{secret:"SECRET_KEY"},{expiresIn:"24h"} )
}

class authController{

   async registration(req,res){
     try {
         const errors = [];
         errors = validationResult(req);
         if(errors){
            return res.status(404).json({message:"Ошибка при регистрации",errors})
         }

         const {username,password} = req.body;
         const candidate = await User.findOne({username})
         if(candidate){
            return res.status(400).json({message:"Пользователь уже существует"})
         }
         const hashPassword = bcrypt.hashSync(password,7)
         const userRole = await Role.findOne({value:"USER"})
         const user = new User({username,hashPassword,roles:[userRole.value]})
         
         await user.save();
         return res.json({message:"Пользователь успешно зарегистрирован"})

     } catch (e) {
        res.status(400).json({message:"Registration error"});
     }


   }
   async login(req,res){
     try {
        const {username,password} = req.body;
        const user = User.find({username});
        if(!user){
           return res.status(404).json({message:`Пользователь с именем ${username} не найден`})
        }
        const validPassword = bcrypt.compareSync(hashPassword,user.password)
        if(!validPassword){
           return res.status(404).json({message:`Введен неверный пороль`})
        }
        const token = generateAccessToken(user._id,user.roles)
        return res.json({token})

     } catch (e) {
         res.status(400).json({message:"Login error"});
        
     }
   
   }

   async getUsers(req,res){
     try {
         const users = await User.find();
         res.json(users)

     } catch (e) {
         console.log(e)
     }


   }

}

export default new authController()