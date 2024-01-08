const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const catchAsync = require("../utils/catchAsync");

exports.createFollowing = catchAsync( async(req,res,next)=>{
    try {
        const createData = await prisma.following.create({
            data: {
                following: req.body.following
            }
        })
        res.status(201).json({
            status: "Success",
            createData
        })
        await prisma.$disconnect();
    } catch (error) {
        console.error(err);
    }
})

exports.getAllFollowing = catchAsync( async (req, res, next) => {
    const allData = await prisma.following.findMany({})

    res.status(200).json({
        status: "success",
        allData,
    });
    await prisma.$disconnect();
})

exports.getOneFollowing = catchAsync( async (req, res, next) => {
    const { id } = req.params

    const data = await prisma.following.findUnique({
        where: {
            id: id
        }
    })
    res.status(200).json({
        status: "success",
        data,
    });
    await prisma.$disconnect();
})

exports.deleteFollowing = catchAsync(async (req, res, next) => {
    await prisma.following.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });

    res.status(200).json({
        status: "success",
    });
    await prisma.$disconnect();

});

exports.updateFollowing = catchAsync(async (req, res, next) => {
    console.log(req.params.id);

    await prisma.following.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: {
           content : req.body.following
        },
    });
    res.status(200).json({
        status: "success",
    });
    await prisma.$disconnect();

});