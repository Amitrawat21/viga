import Blog from "../Model/BlogModel.js";
import cloudinary from "cloudinary";

class blogController {
  constructor() {}

  static createBlog = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("User avatar required");
    }

    const { photo } = req.files;
    const { title, description, createdBy } = req.body;

    if (!title || !description || !createdBy) {
      return res.status(400).send({ message: "Please fill the full form" });
    }

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!cloudinaryResponse) {
        console.error("Unknown cloudinary error!");
        return res.status(500).send({ message: "Avatar upload failed" });
      }

      const newBlog = new Blog({
        title,
        description,
        createdBy,
        photo: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      });

      await newBlog.save();

      return res.status(201).json({
        success: true,
        newBlog,

        message: " create blog successful",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error" });
    }
  };

  static deleteBlog = async (req, res) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findByIdAndDelete(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "blog not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "blog Deleted!",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({
        success: false,
        message: "Server error, please try again later",
      });
    }
  };

  static updateBlog = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: "Blog ID is required" });
      }
  
      const updates = req.body;
      let updatedPhoto = {};
  
      // Check if a new photo is uploaded
      if (req.files && req.files.photo) {
        const { photo } = req.files;
  
        try {
          // Upload the new photo to Cloudinary
          const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
          
          if (!cloudinaryResponse) {
            console.error("Unknown Cloudinary error!");
            return res.status(500).json({ message: "Photo upload failed" });
          }
  
          updatedPhoto.photo = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Photo upload failed" });
        }
      }
  
      // Find and update the blog with new details and photo if available
      const blog = await Blog.findByIdAndUpdate(
        id,
        { ...updates, ...updatedPhoto },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Blog updated!",
        blog: blog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  static getsingleblog = async (req, res, next) => {
    const { id } = req.params;
    let blog= await Blog.findById(id);
    if (!blog) {
      return res.status(400).json({ message: "blog not found!" });
    }
    res.status(200).json({
      success: true,
      blog,
    });
  };
  static getUserAllBlogs = async (req, res) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const blogs = await Blog.find({ createdBy: userId });

      if (!blogs) {
        return res.status(404).json({
          success: false,
          message: "No blogs found for this user",
        });
      }

      return res.status(200).json({
        success: true,
        blogs,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({
        success: false,
        message: "Server error, please try again later",
      });
    }
  };
}


export default blogController