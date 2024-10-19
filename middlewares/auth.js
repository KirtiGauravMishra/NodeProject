import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./error.js";
import { catchAsyncErrors } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});

export default isAuthenticated;
