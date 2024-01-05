const authController = require('../controller/authControlller')
const express = require('express')

const userRouter = express.Router()


userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

module.exports = userRouter