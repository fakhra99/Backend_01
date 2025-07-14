import express from "express";
import {createUser, getUsers, delUser, updateUser, loginUser, deleteAllUsers, getUserById} from "../controllers/userController.js";
import { uploads } from "../middlewares/multerMiddleware.js";

const router = express.Router();

// router.post("/registerUser", createUser);
router.post("/registerUser", uploads.single("image"), createUser);
router.get("/fetchUsers", getUsers);
router.delete("/deleteUser/:id", delUser);
router.put("/updateUser/:id", uploads.single("image"), updateUser);
router.post("/login", loginUser);
router.get("/getSingleUser/:id", getUserById);
router.delete("/delAllUsers", deleteAllUsers);
export default router;