const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function getAllFolders(req, res){
    const folders = await prisma.Folder.findMany({
        select: {
            folderId: true,
            folderName: true
        }
    });

    const foldersWithLink = folders.map(folder => {
        return {
            folderId: folder.folderId,
            folderName: folder.folderName,
            href: `/folder/${folder.folderId}`
        }
    })

    res.render('folderForm', { existingFolders: foldersWithLink })
}

async function getFolderFiles(req, res, next){
    const { folderId } = req.params;
    
    const folder = await prisma.Folder.findUnique({
        where: {
            folderId: Number(folderId)
        },
        include: { files: true }
    })

    if (!folder) {
        const error = new Error("Folder not Found");
        error.status = 404;
        return next(err);
    }

    let filesWithLink = folder.files.map(file => ({
        fileId: file.fileId,
        fileName: file.fileName,
        href: `/folder/${folderId}/${file.fileId}`
    }));

    res.render('folderView', { folder: folder, files: filesWithLink })
}