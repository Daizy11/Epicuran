const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const catchAsync = require("../utils/catchAsync");

exports.createFollower = catchAsync( async(req,res,next)=>{
    try {
        const createData = await prisma.follower.create({
            data: {
                follower: req.body.follower
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

exports.getAllFollower = catchAsync( async (req, res, next) => {
    const allData = await prisma.follower.findMany({})

    res.status(200).json({
        status: "success",
        allData,
    });
    await prisma.$disconnect();
})

exports.getOneFollower = catchAsync( async (req, res, next) => {
    const { id } = req.params

    const data = await prisma.follower.findUnique({
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

exports.deleteFollower = catchAsync(async (req, res, next) => {
    await prisma.follower.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });

    res.status(200).json({
        status: "success",
    });
    await prisma.$disconnect();

});

exports.updateFollower = catchAsync(async (req, res, next) => {
    console.log(req.params.id);

    await prisma.follower.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: {
           content : req.body.follower
        },
    });
    res.status(200).json({
        status: "success",
    });
    await prisma.$disconnect();

});