import mongoose, {Document} from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model<IUser>('user', userSchema);
export default userModel;