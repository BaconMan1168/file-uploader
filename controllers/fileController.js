const { PrismaClient } = require('@prisma/client');
const { isAuth } = require('../authMiddleware').isAuth

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