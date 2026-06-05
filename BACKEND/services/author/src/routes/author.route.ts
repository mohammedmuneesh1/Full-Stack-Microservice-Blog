
import express from 'express';
import isAuth from '../middleware/isAuth.js';
import tryCatch from '../utils/tryCatch.js';
import { AI_BLOG_CONTENT_GRAMMER_CORRECTOR_CONTROLLER, AI_DESCRIPTION_GENERATOR_OR_CORRECTOR_CONTROLLER, aiTitleResponse, CREATE_BLOG_CONTROLLER, DELETE_BLOG_CONTROLLER, UPDATE_BLOG_CONTROLLER } from '../controllers/author.controller.js';
import createUploadMulter from '../middleware/multer.js';

const router = express.Router();

router.route('/').post(isAuth,createUploadMulter().single('image'),tryCatch(CREATE_BLOG_CONTROLLER));
router.route('/:id').put(isAuth,createUploadMulter().single('image'),tryCatch(UPDATE_BLOG_CONTROLLER));
router.route('/:id').delete(isAuth,tryCatch(DELETE_BLOG_CONTROLLER));
router.route('/ai/title').post(isAuth,tryCatch(aiTitleResponse));
router.route('/ai/description').post(isAuth,tryCatch(AI_DESCRIPTION_GENERATOR_OR_CORRECTOR_CONTROLLER));
router.route('/ai/blog').post(isAuth,tryCatch(AI_BLOG_CONTENT_GRAMMER_CORRECTOR_CONTROLLER));

export default router;
