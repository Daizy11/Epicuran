const express = require('express')
const userRouter = require('./router/userRouter')
const globalError = require('./controller/errorController')
const app = express()


app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/user',userRouter)
app.use(globalError)

module.exports = app;

