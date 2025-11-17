const { Router } = require('express')
const fileRouter = Router();
const fileController = require('../controllers/fileController')

fileRouter.get('/upload', fileController.getFileForm); 
//need to add file uplaoding/post logic 
fileRouter.get('/:folderId/:fileId', fileController.getFileInfo);