const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); 
const multer = require('multer');


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',     
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx'], 
    }
});

const upload = multer({ storage });

module.exports = upload