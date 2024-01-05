const express = require('express')
const userRouter = require('./router/userRouter')
const app = express()


app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use('api/v1/user',userRouter)

module.exports = app;

