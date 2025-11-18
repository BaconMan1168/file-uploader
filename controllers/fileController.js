const { PrismaClient } = require('@prisma/client');
const { isAuth } = require('../authMiddleware').isAuth
const multer = require('multer')
const upload = ('../config/cloudinaryStorage')

const prisma = new PrismaClient();

const getFileForm = [
    isAuth,
    async (req, res, next) => {
        const folders = await prisma.Folder.findMany({
            select: {
                folderId: true,
                folderName: true
            }
        });

        if (!folders){
            res.redirect('/folder')
        }
        next();
    },
    (req, res) => {
        res.render('fileUpload')
    }
]

async function getFileInfo(req, res){
    const { fileId } = req.params;

    const file = await prisma.File.findUnique({
        where: {
            fileId: Number(fileId)
        },
        include: { 
            fileName: true,
            size: true,
            uploadDate: true,
            url: true
         }
    })

    if (!file) {
        const error = new Error("File not Found");
        error.status = 404;
        return next(err);
    }

    res.render('fileView', { file: file })
}

const uploadFile = [
    upload.single("file"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).send("No file uploaded.");
            }

            const { originalname, size, path } = req.file;

            let folder = await prisma.Folder.findFirst({
                where: {
                    folderName: folderName,
                    ownerId: req.user.id
                }
            });

            const result = await prisma.File.create({
                data: {
                    fileName: originalname,
                    size: size,
                    url: req.file.path, 
                    path: req.file.path,
                    parentFolderId: folder.folderId
                }
            });

            res.redirect(`/files/${result.fileId}`);
        } catch (err) {
            next(err);
        }
    }
]

module.exports = {
    getFileForm,
    getFileInfo,
    uploadFile
}