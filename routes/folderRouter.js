const { Router } = require('express')
const folderRouter = Router();
const folderController = require('../controllers/folderController')


folderRouter.get('/', folderController.getAllFolders);
folderRouter.post('/create', folderController.createFolder);
folderRouter.post('/update', folderController.updateFolder);
folderRouter.post('/delete', folderController.deleteFolder);