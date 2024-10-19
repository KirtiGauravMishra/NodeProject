import express from "express";
import { register,login } from "../controllers/userController.js";
import {isAuthenticated} from "../middlewares/auth.js";
 
const router = express.Router();

router.post("/register",register);
router.post("/login",login);

router.get("/profile", isAuthenticated, (req, res, next) => {
    const { name, email, createdAt } = req.user;
    res.status(200).json({
        success: true,
        user: {
            name,
            email,
            registrationDate: createdAt,
        },
    });
});

export default router;