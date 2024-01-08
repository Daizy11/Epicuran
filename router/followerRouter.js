const followerRouter = require('../controller/follower')
const express = require('express')

const userRouter = express.Router()

userRouter.route('/').get(followerRouter.getAllFollower).post(followerRouter.createFollower)
userRouter.route('/:id').get(followerRouter.getOneFollower).patch(followerRouter.updateFollower).delete(followerRouter.deleteFollower)


module.exports = userRouter