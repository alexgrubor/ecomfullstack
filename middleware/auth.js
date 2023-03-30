import jwt from "jsonwebtoken";
import User from "../models/Users.js";
const auth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource.",
      });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "You are not authorized to access this resource.",
      error: err.message,
    });
  }
};

export default auth;