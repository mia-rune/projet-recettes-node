const multer = require("multer");
const path = require("path");
const fs = require("fs");

const mimeType = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

// Créer le dossier uploads s'il n'existe pas
const uploadDir = './public/uploads';
if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public', { recursive: true });
}
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: function (req, file, cb) {
        if (!mimeType.includes(file.mimetype)) {
            req.multerError = true;
            return cb(null, false);
        }
        cb(null, true);
    }
});

module.exports = upload;