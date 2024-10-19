
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Joi from 'joi';

export const Create  = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role = "user" } = req.body;

    const validator = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      role: Joi.string().valid("admin", "user").optional()
    });
    
    const { error } = validator.validate(req.body);
    if (error) {
        return next(new ErrorHandler(error.details[0].message, 400));
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler("Email is already taken!", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    user.password = undefined; 
    res.status(201).json({
        success: true,
        user,
    });
});

export const Getuser  = catchAsyncErrors(async (req, res, next) => {
    const { page = 1, limit = 10, name, email, role } = req.query;

    const query = {};
    
    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = { $regex: email, $options: "i" };
    if (role) query.role = role;

    // Get paginated users
    const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        users,
    });
});

export const updateuser  = catchAsyncErrors(async (req, res, next) => {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (role && !["admin", "user"].includes(role)) {
        return next(new ErrorHandler("Invalid role provided", 400));
    }

    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return next(new ErrorHandler("Email is already taken", 400));
        }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
    });
});

export const deleteuser  = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
        return next(new ErrorHandler("Admins cannot delete themselves", 400));
    }

    await user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});