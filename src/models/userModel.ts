import mongoose, {Document} from "mongoose";

export interface IUser extends Document{
    name: String,
    email:String,
    password:String,
    role:String
}

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    role: {
        type:String,
        required:true,
        enum:["user", "admin"],
        default:"user"
    }
})

const userModel = mongoose.model<IUser>('user', userSchema);
export default userModel;