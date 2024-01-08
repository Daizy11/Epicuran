const followingRouter = require('../controller/following')
const express = require('express')

const userRouter = express.Router()

userRouter.route('/').get(followingRouter.getAllFollowing).post(followingRouter.createFollowing)
userRouter.route('/:id').get(followingRouter.getOneFollowing).patch(followingRouter.updateFollowing).delete(followingRouter.deleteFollowing)


module.exports = userRouter