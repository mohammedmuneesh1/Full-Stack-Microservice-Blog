
import type { Request, Response } from "express";
import UserModel from "../models/user.schema.js";
import jwt from 'jsonwebtoken';
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import ResponseHandler from "../utils/responseHandler.js";
import mongoIdValidate from "../utils/mongoIdValidate.js";
import mongoose from "mongoose";
import generateToken from "../utils/generateToken.js";
import cloudinaryOptions from "../utils/cloudinaryManagement.js";
import type { CloudinaryUploadResponse } from "../types/cloudinaryType.js";
import type { UploadApiResponse } from "cloudinary";
import { oauth2client } from "../utils/googleConfig.js";
import axios from 'axios';


export const USER_LOGIN_FN = async(req:Request,res:Response)=>{
       
    console.log("final request reached here");
        const {code } = req.body;
        if(!code){
            return ResponseHandler(res,200,false,null,'Code not found');
        };
            
        const googleResponse = await oauth2client.getToken(code); 
        console.log('googleResponse',googleResponse);
        //Sends the authorization code to Google
        //Google replies with tokens
        //{ 
//   "access_token": "ya29.a0AfH6SM...",
//   "id_token": "eyJhbGciOiJSUzI1NiIs...",
//   "refresh_token": "1//0gXYZ...",
//   "expires_in": 3599
// }

   // 2️⃣ Load tokens into OAuth client
        oauth2client.setCredentials(googleResponse?.tokens);
        //“Hey, these are now your active credentials. Use them automatically when making Google API calls.”



        const userRes = await axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse?.tokens.access_token}`);

        const {email,name,  picture:image} = userRes.data;







    //    const {email,name,image} = req.body;
        let isUserExist = await UserModel.findOne({email});
        
        if(!isUserExist){
            isUserExist = await UserModel.create({email,name,image});
        }
        if(!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
            const token = generateToken({
                  id:isUserExist._id,
                name:isUserExist.name
                },
                '30d'
             ); 


            //  res.cookie('token',
            //     token,
            //     {
            //           httpOnly: true,
            //           secure: false,
            //          sameSite: "lax",
            //         maxAge:30*24*60*60*1000, // 30 days
            //     });


        return res.status(200).json({
            success:true,
            data:{
                token: token,
            },
            response:'User login successfully',
        });

}






/**
 * @desc    Get MY PROFILE BY ID 
 * @route   GET /api/users/profile/:id
 * @access  Private
 * @returns  MY profile object
 */

export async function MY_PROFILE(req:AuthenticatedRequest, res:Response) {
    const id = req.user?.id;
    if(!mongoIdValidate(id)) {
        return ResponseHandler(res,401,true,null,'User profile fetched successfully');
    }
    const user = await UserModel.findOne({
          _id: new mongoose.Types.ObjectId(id),
          isDeleted: false,
    }).select('-__v -updatedAt');
    if(!user) {
    return ResponseHandler(res,200,true,null,'User not found');
    }
    return ResponseHandler(res,200,true,user,'User profile fetched successfully');
}

/**
 * @desc    Get USER PROFILE BY ID params
 * @route   GET /api/u-profile/:id
 * @access  Private
 * @returns  user profile object
 */

export async function GET_USER_PROFILE_BY_ID(req:AuthenticatedRequest, res:Response) {
    const id = req.params.id;
    
    if(!mongoIdValidate(id)) {
        return ResponseHandler(res,401,true,null,'User profile fetched successfully');
    }
    const user = await UserModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      isDeleted: false
      }).select('-__v -updatedAt');

    if(!user) {
    return ResponseHandler(res,200,false,null,'User not found');
    }

    return ResponseHandler(res,200,true,user,'User profile fetched successfully');
}



/**
 * @desc    put USER PROFILE BY ID params
 * @route   PUT /api/profile/:id
 * @access  Private
 * @returns  user profile object
 */

export async function UPDATE_USER_PROFILE_BY_ID(req:AuthenticatedRequest, res:Response) {
    
    const data = req.body;
    // const id = req.params.id;
    const user = req.user;
    // console.log('user',user)
    // if(!mongoIdValidate(id)) {
    //     return ResponseHandler(res,401,true,null,'User profile fetched successfully');
    // }
    const updatingData = {
  ...(data?.name !== undefined && { name: data.name }),
  ...(data?.image !== undefined && { image: data.image }),
  ...(data?.instagram !== undefined && { instagram: data.instagram }),
  ...(data?.facebook !== undefined && { facebook: data.facebook }),
  ...(data?.linkedin !== undefined && { linkedin: data.linkedin }),
  ...(data?.bio !== undefined && { bio: data.bio }),
    };



     const updatedUser = await UserModel.findOneAndUpdate(
     { _id: new mongoose.Types.ObjectId(user?.id), },
      updatingData,
     { new: true } // return the updated document
).select('-__v -updatedAt');

    if(!updatedUser) {
    return ResponseHandler(res,200,true,null,'User not found');
    }

    const token = generateToken({
        id:updatedUser._id,
        name:updatedUser.name
    },
    '30d'
); 
    return ResponseHandler(res,200,true,{user:updatedUser,token},'User profile updated successfully');
}



/**
 * @desc    put udpate user profile picture
 * @route   PUT /api/profile/pic
 * @access  Private
 * @returns  user profile object
 */

export async function UPDATE_USER_PROFILE_PIC(req:AuthenticatedRequest, res:Response):Promise<Response>{
    const file = req.file;
    if(!file){
        return ResponseHandler(res,200,false,null,'File  not found');
    }
    const id = req.user?.id;
    if(!mongoIdValidate(id)) {
        return ResponseHandler(res,401,true,null,'Invalid user found. Please login again');
    }

    const result:UploadApiResponse | undefined  = await cloudinaryOptions.uploadItem(file.buffer,"profilePic");

    if(!result){
        return ResponseHandler(res,200,false,null,'Image upload has been failed. Please try again later.');
    }

    const updatedUser = await UserModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id), },
         { cloudinaryImage: {
            url:result.secure_url as string,
            publicId:result.public_id as string
         } },
        { new: true } // return the updated document
    ).select('-__v -updatedAt');

    return ResponseHandler(res,200,true,updatedUser,'Image uploaded successfully');

}

1



//  const file = req.file;