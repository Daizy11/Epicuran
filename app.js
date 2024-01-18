const express = require('express')
const userRouter = require('./router/userRouter')
const followingRouter = require('./router/followingRouter')
const followerRouter = require('./router/followerRouter')
const postRouter = require('./router/postRouter')
const globalError = require('./controller/errorController')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const session = require('express-session')
const app = express()

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://localhost:3000/seller/login'],
        credentials: true,            //access-control-allow-credentials:true
        methods: ["POST", "GET"],
    }
));
app.use(session({
    secret: process.env.JWT_SECRET, // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: false,
}));
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/user', userRouter)
app.use('/api/v1/follower', followerRouter)
app.use('/api/v1/following', followingRouter)
app.use('/api/v1/post', postRouter)


app.use(globalError)

module.exports = app;

