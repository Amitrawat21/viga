import mongoose from "mongoose";

const blogSchema  = mongoose.Schema({
  title: {
    type: String,
  },

  description: {
    type: String,
  },
 
  
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },

  photo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
