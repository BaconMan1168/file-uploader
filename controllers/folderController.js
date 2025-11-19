const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function getAllFolders(req, res){
    const folders = await prisma.folder.findMany({
        select: {
            folderId: true,
            folderName: true
        }
    });



    if (!folders.length){
        res.render('folderForm', { noFolders: true })
    }
    else {
        const foldersWithLink = folders.map(folder => {
            return {
                folderId: folder.folderId,
                folderName: folder.folderName,
                href: `/folder/${folder.folderId}`
            }
        })

        res.render('folderForm', { existingFolders: foldersWithLink, noFolders: false })
    }

}

async function createFolder(req, res){
    const { folderName } = req.body;
    const { id } = req.user;

    await prisma.folder.create({
        data: {
            folderName: folderName,
            ownerId: id

        }
    })
}

async function updateFolder(req, res){
    const { oldFolderName, newFolderName } = req.body;
    
    await prisma.folder.update({
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

    await prisma.folder.delete({
        where: {
            folderName: folderToDelete
        }
    })
}


async function getFolderFiles(req, res, next){
    const { folderId } = req.params;
    
    const folder = await prisma.folder.findUnique({
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

