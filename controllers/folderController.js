const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function getAllFolders(req, res){
    const folders = await prisma.Folder.findMany({
        select: {
            folderId: true,
            folderName: true
        }
    });

    if (!folders){
        res.render('folderForm', { noFolders: true })
    }

    const foldersWithLink = folders.map(folder => {
        return {
            folderId: folder.folderId,
            folderName: folder.folderName,
            href: `/folder/${folder.folderId}`
        }
    })

    res.render('folderForm', { existingFolders: foldersWithLink })
}

async function createFolder(req, res){
    const { folderName } = req.body;
    const { id } = req.user;

    await prisma.Folder.create({
        data: {
            folderName: folderName,
            ownderId: id

        }
    })
}

async function updateFolder(req, res){
    const { oldFolderName, newFolderName } = req.body;
    
    await prisma.Folder.update({
        where: {
            folderName: oldFolderName
        },
        data: {
            folderName: newFolderName
        }
    })
}

async function deleteFolder(req, res){
    const { folderToDelete } = req.body;

    await prisma.Folder.delete({
        where: {
            folderName: folderToDelete
        }
    })
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

module.exports = {
    getAllFolders,
    getFolderFiles,
    createFolder,
    updateFolder,
    deleteFolder
}

