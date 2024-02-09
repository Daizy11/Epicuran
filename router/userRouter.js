const authController = require('../controller/authControlller')
const userController = require('../controller/userController')
const express = require('express')

const userRouter = express.Router()


userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.delete('/:id',userController.deleteUser)
userRouter.use(authController.protect);
userRouter.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser)

module.exports = userRouter