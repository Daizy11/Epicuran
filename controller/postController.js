const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const catchAsync = require("../utils/catchAsync");

exports.createPost = catchAsync (async (req, res, next) => {
    try {
        const createData = await prisma.post.create({
            data: {
                content: req.body.content
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

exports.getAllPost = catchAsync( async (req, res, next) => {
    const allData = await prisma.post.findMany({})

    res.status(200).json({
        status: "success",
        allData,
    });
    await prisma.$disconnect();
})

exports.getOnePost = catchAsync( async (req, res, next) => {
    const { id } = req.params

    const data = await prisma.post.findUnique({
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

exports.deletePost = catchAsync(async (req, res, next) => {
    await prisma.post.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });

    res.status(200).json({
        status: "success",
    });
    await prisma.$disconnect();

});

exports.updatePost = catchAsync(async (req, res, next) => {
    console.log(req.params.id);

    await prisma.post.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: {
           content : req.body.content
        },
    });
    res.status(200).json({
        status: "success",
    });
    await prisma.$disconnect();

});