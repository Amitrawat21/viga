import express from "express"
import blogController from "../Controller/blogController.js"
import Authentication from "../Middleware/Auth.js"


const router = express.Router()
router.post("/createBlog" , blogController.createBlog)
router.delete("/deleteBlog/:id" , blogController.deleteBlog)
router.put("/updateBlog/:id" , blogController.updateBlog)
router.get("/singleblog/:id" , blogController.getsingleblog)
router.get("/userAllblogs/:id" , blogController.getUserAllBlogs)






export default router
