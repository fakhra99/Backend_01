import express from "express";
import {createUser, getUsers, delUser, updateUser} from "../controllers/userController.js";

const router = express.Router();

router.post("/registerUser", createUser);
router.get("/fetchUsers", getUsers);
router.delete("/deleteUser/:id", delUser)
router.put("/updateUser/:id", updateUser)

export default router;