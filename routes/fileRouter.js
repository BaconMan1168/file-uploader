const { Router } = require('express')
const fileRouter = Router();
const fileController = require('../controllers/fileController')

fileRouter.get('/upload', fileController.getFileForm); 
fileRouter.get('/:folderId/:fileId', fileController.getFileInfo);
fileRouter.post('/upload', fileController.uploadFile);

module.exports = fileRouter;