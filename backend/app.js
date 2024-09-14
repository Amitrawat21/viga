import express from "express";
import dotenv from "dotenv";

import fileUpload from "express-fileupload";
import userRouter from "./Route/UserRoutes.js";
import blogRouter from "./Route/BlogRoutes.js"
import cloudinary from "cloudinary";
import cors from "cors";
import "./Connection/Connection.js";



dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use("/user", userRouter);
app.use("/blog", blogRouter);
const port = 8000;


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
