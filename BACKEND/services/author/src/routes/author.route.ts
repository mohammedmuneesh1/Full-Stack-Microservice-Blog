
import express from 'express';
import isAuth from '../middleware/isAuth.js';
import tryCatch from '../utils/tryCatch.js';
import { CREATE_BLOG_CONTROLLER, DELETE_BLOG_CONTROLLER, UPDATE_BLOG_CONTROLLER } from '../controllers/author.controller.js';
import createUploadMulter from '../middleware/multer.js';

const router = express.Router();

router.route('/').post(isAuth,createUploadMulter().single('image'),tryCatch(CREATE_BLOG_CONTROLLER));
router.route('/:id').put(isAuth,createUploadMulter().single('image'),tryCatch(UPDATE_BLOG_CONTROLLER));
router.route('/:id').delete(isAuth,tryCatch(DELETE_BLOG_CONTROLLER));

export default router;
