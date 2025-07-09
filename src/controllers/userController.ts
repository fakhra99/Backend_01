import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import { Request, Response } from "express";

export const createUser = async(req:Request, res:Response)=>{
  try{
    const {name, email, password, role}=req.body;

    if(!name || !email || !password){
      return res.status(400).json({ message: "all fields are required"});
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser){

      return res.status(409).json({message: "user already exist"});
    }
    const newUser = new userModel({name, email, password, role});
    await newUser.save();

    return res.status(200).json({
      message: "user saved successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role:newUser.role
      }
    });

  }
  catch(error){
    console.error("error creating user", error)
    return res.status(500).json({messag: "internal server error", error})
  }
}

// get users
export const getUsers = async(req:Request, res:Response)=>{
  try {
    const users = await userModel.find();
    return res.status(200).json({message: "users fetched successfully", users})
  } catch (error) {
    console.error("error fetching users", error);
    return res.status(500).json({message: "internal server error", error})
  }
}