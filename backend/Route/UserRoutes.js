import express from "express"
import UserController from "../Controller/userController.js"



const router = express.Router()
router.post("/register" , UserController.registration)
router.post("/login" , UserController.login)


export default router
