const { PrismaClient } = require('@prisma/client');
const isAuth = require('../authMiddleware').isAuth;
const upload = require('../config/cloudinaryStorage')


const prisma = new PrismaClient();

const getFileForm = [
    isAuth,
    async (req, res, next) => {
        const folders = await prisma.folder.findMany({
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

    const file = await prisma.file.findUnique({
        where: {
            fileId: Number(fileId)
        },
        select: { 
            fileName: true,
            size: true,
            uploadDate: true,
            url: true
         }
    })

    console.log(file);

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

            const { folderName } = req.body
            const { originalname, size } = req.file;
            console.log(req.file)

            let folder = await prisma.folder.findFirst({
                where: {
                    folderName: folderName,
                    ownerId: req.user.id
                }
            });

            const result = await prisma.file.create({
                data: {
                    fileName: originalname,
                    size: size,
                    url: req.file.path, 
                    path: req.file.path,
                    parentFolderId: folder.folderId
                }
            });

            

            res.redirect(`/file/uploadSuccess`);
        } catch (err) {
            next(err);
        }
    }
]

function getUploadSuccess(req, res){
    res.render('uploadSuccess');
}

module.exports = {
    getFileForm,
    getFileInfo,
    uploadFile,
    getUploadSuccess
}