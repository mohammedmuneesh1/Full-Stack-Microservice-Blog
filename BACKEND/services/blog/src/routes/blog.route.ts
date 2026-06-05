import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import tryCatch from '../utils/tryCatch.js';
import { ADD_COMMENT, DELETE_COMMENT, GET_ALL_BLOGS_CONTROLLERS, GET_ALL_SAVED_BLOGS, GET_BLOG_COMMENT_BY_ID, GET_OWN_BLOGS, GET_SINGLE_BLOG_CONTROLLER, SAVE_BLOG_CONTROLLER } from '../controllers/blog.controller.js';

const router = express.Router();



router.route('/all').get(isAuth,tryCatch(GET_ALL_BLOGS_CONTROLLERS));
router.route("/saved").get(isAuth,tryCatch(GET_ALL_SAVED_BLOGS));
router.route("/own-blogs").get(isAuth,tryCatch(GET_OWN_BLOGS));


router.route("/comments/:id").get(isAuth,tryCatch(GET_BLOG_COMMENT_BY_ID));
router.route("/comments/:id").post(isAuth,tryCatch(ADD_COMMENT));
router.route("/:id").get(isAuth,tryCatch(GET_SINGLE_BLOG_CONTROLLER));
router.route("/comments/:id/:commentId").delete(isAuth,tryCatch(DELETE_COMMENT));
router.route("/comments/:id/:commentId").delete(isAuth,tryCatch(DELETE_COMMENT));
router.route("/save-remove/:id").put(isAuth,tryCatch(SAVE_BLOG_CONTROLLER));




export default router;


