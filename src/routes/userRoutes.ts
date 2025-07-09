import express from "express";
import {createUser, getUsers, delUser} from "../controllers/userController.js";

const router = express.Router();

router.post("/registerUsers", createUser);
router.get("/fetchUsers", getUsers);
router.delete("/deleteUser", delUser)

export default router;