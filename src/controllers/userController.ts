import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const createUser = async(req:Request, res:Response) =>{
  try{
    const {name, email, password, role}=req.body;

    if(!name || !email || !password){
      return res.status(400).json({ message: "all fields are required"});
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser){

      return res.status(409).json({message: "user already exist"});
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new userModel({ name, email, password: hashPassword, role });
    await newUser.save();

    return res.status(200).json({
      message: "user saved successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role:newUser.role,
        password:newUser.password
      }
    });

  }
  catch(error){
    console.error("error creating user", error)
    return res.status(500).json({message: "internal server error", error})
  }
}

// get users
export const getUsers = async(req:Request, res:Response) =>{
  try {
    const users = await userModel.find();
    return res.status(200).json({message: "users fetched successfully", users})
  } catch (error) {
    console.error("error fetching users", error);
    return res.status(500).json({message: "internal server error", error})
  }
}

// delete user
export const delUser = async(req:Request, res:Response) => {
  try {
    const userId = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({message: "invalid user id"})
    }

    const deletedUser = await userModel.findByIdAndDelete(userId);
    if(!deletedUser){
      return res.status(404).json({message: "user not found"});
    }

    return res.status(200).json({message: "user deleted successfully", deletedUser})
  }
  catch (error) {
    console.error("Error deleting user", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "invalid user id" });
    }

    const { name, email, password, role } = req.body;

    const updateFields: any = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({
      message: "user updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("error updating user", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
