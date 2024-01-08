const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED_IN,
    });
};

exports.protect = catchAsync(async (req, res, next) => {
    // to protect the id and use the JWT  
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      return next(
        new AppError("You are not log in, please log in to get access", 401)
      );
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //seeing if the payload token has not been manipulated by some malicious third party
  
    const currentUser = await prisma.seller.findUnique({
      where: {
        id: decoded.id //id of user 
      }
    })
    if (!currentUser) {
      return next(
        new AppError(
          "The token belonging to this user does no longer exist",
          401
        )
      );
    }
   
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);
    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, //receive cookie,store it, send it automatically along every request
    };

    if (process.env.NODE_ENV === "Production") cookieOption.secure = true;

    //remove password from the output
    user.password = undefined;
    res.cookie("jwt", token, cookieOption);

    res.status(statusCode).json({
        status: "Success",
        token,
        data: {
            user,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            },
        });

        createSendToken(user, 201, res);
        res.status(201).json({
            status: "success",
            user,
        });

    } catch (error) {
        next(new AppError("Email is Duplicate",400)) 
        // console.error(error)
        res.status(500).json({ error });
    }

});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body)
    //1. Check password and email are exist
    if (!password) {
        return next(new AppError("Please provide email and password", 401));
    }
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },

    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, res);
});