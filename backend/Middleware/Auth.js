import jwt from "jsonwebtoken";
import User from "../Model/UserModel.js";

const Authentication = async (req, res, next) => {
  const token = req.headers.auth;
  console.log(token , "tokennnnnn")


  if (!token) {
    res.status(401).send({ error: "please autheticaztion using valid token" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      res
        .status(401)
        .send({ erros: "please authenticate using a valid token" });
    }
  }
};

export default Authentication;

