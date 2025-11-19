const { Router } = require('express')
const folderRouter = Router();
const folderController = require('../controllers/folderController')
const fileController = require('../controllers/fileController')


folderRouter.get('/', folderController.getAllFolders);
folderRouter.post('/create', folderController.createFolder);
folderRouter.post('/update', folderController.updateFolder);
folderRouter.post('/delete', folderController.deleteFolder);
folderRouter.get('/:folderId', folderController.getFolderFiles);
folderRouter.get('/:folderId/:fileId', fileController.getFileInfo);

module.exports = folderRouter;