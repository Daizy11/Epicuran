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
        // console.log(user.code)

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