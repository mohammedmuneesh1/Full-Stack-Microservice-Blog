import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image:string;
    instagram:string;
    facebook:string;
    linkedin:string;
    bio:string;
    isDeleted:boolean;
    isActive:boolean;
    cloudinaryImage:{
        url:string;
        publicId:string;
    }
}

const schema:Schema<IUser> = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image:{
        type:String,
    },
    cloudinaryImage:{
        url:String,
        publicId:String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    instagram:String,
    facebook:String,
    linkedin:String,
    bio:String,
},{
    timestamps:true,
});

const UserModel = mongoose.model<IUser>('User', schema);
export default UserModel;


