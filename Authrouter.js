import Router from "express"
import authController from "./authController.js";
import { check } from "express-validator";

const router = new Router();

router.post("/registration",[
    check("username","имя пользователя не может быть пустым").notEmpty(),
    check("password","Пороль должен быть больше 4 и меньше 10").isLength({min:4,max:10})
],authController.registration)

router.post("/login",authController.login)

router.get("/users",authController.getUsers)

export default router