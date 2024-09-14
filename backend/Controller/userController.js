import User from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";

class UserController {
  constructor() {}

  static registration = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("User avatar required");
    }

    const { photo } = req.files;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: "Please fill the full form" });
    }

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(403).send({ message: "Email already exists" });
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!cloudinaryResponse) {
        console.error("Unknown cloudinary error!");
        return res.status(500).send({ message: "Avatar upload failed" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        photo: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        user: newUser,
        message: "Registration successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error" });
    }
  };
  static login = async (req, res) => {
    
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send({ message: "Please provide email and password!" });
    }
  
    try {
      const user = await User.findOne({ email });
      console.log(user, 'user')
      if (!user) {
        return res.status(403).send({ message: "Invalid email" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(402).send({ message: "Wrong password" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
  
    
      return res.status(201).json({
        success: true,
        user: user,
        message: "Login successful",
        token,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error" });
    }
  };
}

export default UserController;
