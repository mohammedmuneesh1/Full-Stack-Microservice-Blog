import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import tryCatch from '../utils/tryCatch.js';
import { GET_ALL_BLOGS_CONTROLLERS, GET_SINGLE_BLOG_CONTROLLER } from '../controllers/blog.controller.js';

const router = express.Router();



router.route('/all').get(isAuth,tryCatch(GET_ALL_BLOGS_CONTROLLERS));
router.route('/:id').get(isAuth,tryCatch(GET_SINGLE_BLOG_CONTROLLER));






export default router

