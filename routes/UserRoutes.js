

import {Router} from "express"

import UserController from "../controllers/UserController.js"
import {LoginSchema,CreateUserSchema} from "../models/User.js"
import validate from "../middleware/ValidateMiddleware.js"
import UserService from "../services/UserService.js"

const router=Router();

const controller=new UserController(new UserService());

router.post("/auth/login",
    validate(LoginSchema),
    controller.login);

router.post("/auth/register",
    validate(CreateUserSchema),
    controller.register);


export default router