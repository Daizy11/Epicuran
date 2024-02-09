const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const multer = require('multer');
const AppError = require("../utils/appError")
const sharp = require('sharp')

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj,...allowedFields)=>{
    const newObj = {}
    Object.keys(obj).forEach(el =>{
      if(allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
  }

exports.resizeUserPhoto =  async (req,file,next)=>{
    if(!req.file){
      return next()
    }
    req.file.filename = `user${req.user.id}-${Date.now()}.webp` //save file into db
   await sharp(req.file.buffer).resize(500,500).toFormat('webp').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`) 
    next()
    
  }  
exports.updateUser = async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        next(
          new AppError(
            'This route is not for user password update.Please use /updateMYpassword '
          ),
          400
        );
      }
    const filterBody = filterObj(req.body, 'name', 'email');
    if(req.file) filterBody.photo = req.file.filename
    const updatedUser = await prisma.user.update({
        where:{
            id:req.user.id
        },
        data:{
            photo:filterBody.photo
        }
    })
    console.log(updatedUser)
    res.status(200).json({
      status: 'Success',
      data: {
        user: updatedUser,
      },
    });
}

exports.deleteUser = async (req, res, next) => {
    try {
        await prisma.user.delete({
            where: {
                id: req.body.id
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error });
    }

}