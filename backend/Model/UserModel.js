import mongoose from "mongoose";

const userSchema  = mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  password: {
    type: String,
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

const User = mongoose.model("User", userSchema);
export default User;
