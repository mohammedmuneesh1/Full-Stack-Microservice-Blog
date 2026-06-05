import express from 'express'
import {  GET_USER_PROFILE_BY_ID, MY_PROFILE, UPDATE_USER_PROFILE_BY_ID, UPDATE_USER_PROFILE_PIC, USER_LOGIN_FN } from '../controller/user.controller.js';
import tryCatch from '../utils/tryCatch.js';
import isAuth from '../middleware/isAuth.js';
import createUploadMulter from '../middleware/multer.js';
 export const router = express.Router();


 router.route('/profile/pic').put(
   isAuth,
   createUploadMulter().single('image'),
   tryCatch(UPDATE_USER_PROFILE_PIC)
);
 router.route('/profile').put(isAuth,tryCatch(UPDATE_USER_PROFILE_BY_ID));
 router.route('/login').post(tryCatch(USER_LOGIN_FN));
 router.route('/profile').get(isAuth,tryCatch(MY_PROFILE));
 router.route('/u-profile/:id').get(isAuth,tryCatch(GET_USER_PROFILE_BY_ID));
 router.route('/hello').get((req,res)=>{
    res.status(200).json({message:"hello"})
 });

