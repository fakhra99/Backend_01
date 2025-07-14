import mongoose, {Document} from "mongoose";

export interface IUser extends Document{
    name: string,
    email:string,
    password:string,
    role:string,
    image?: string
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
    },

    image: {
        type: String
    }
})

const userModel = mongoose.model<IUser>('user', userSchema);
export default userModel;