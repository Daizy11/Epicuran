const postController = require('../controller/postController')
const authController = require('../controller/authControlller')
const express = require('express')

const userRouter = express.Router()

userRouter.route('/').get(postController.getAllPost).post(authController.protect,postController.createPost)
userRouter.route('/:id').get(postController.getOnePost).patch(postController.updatePost).delete(postController.deletePost)


module.exports = userRouter