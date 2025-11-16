const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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