const { Router } = require('express')
const fileRouter = Router();
const fileController = require('../controllers/fileController')

fileRouter.get('/', fileController.getFileForm);
fileRouter.get('/:folderId/:fileId', fileController.getFileInfo);