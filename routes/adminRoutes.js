import express from "express";
import { Create,Getuser,updateuser,deleteuser  } from "../controllers/adminController.js";
import {isAuthenticated} from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";
 
const router = express.Router();

router.post("/users",isAuthenticated,isAdmin,Create);
router.get("/users",isAuthenticated,isAdmin,Getuser);
router.put("/users/:id",isAuthenticated,isAdmin,updateuser);
router.delete("/users/:id",isAuthenticated,isAdmin,deleteuser);

export default router;