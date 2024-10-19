import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import Joi from 'joi';

// Register User-
export const register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const validator = Joi.object({
      name: Joi.string().required().messages({
        'any.required': 'Name is required'
      }),
      email: Joi.string().required().messages({
        'any.required': 'Email is required'
      }),
      password: Joi.string().required().messages({
        'any.required': 'Password is required'
      }),
      role: Joi.string().required().messages({
        'any.required': 'Role is required'
      }),
    });
  
    const { error } = validator.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const isEmail = await User.findOne({ email });
    if (isEmail){
      return next(new ErrorHandler("Email is already taken!"));
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    user.password = undefined;
    res.status(201).json({ user });
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new ErrorHandler("Please provide email, password and role."));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    if (user.role !== role) {
      return next(
        new ErrorHandler(`User with provided email and ${role} role not found!`, 404)
      );
    }
    user.password = undefined;
    sendToken(user, 201, res, "User Logged In!");
});
 

