const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        console.log(req.body);
        cb(null, `${req.body.name}_${req.body.birthday}.jpg`);
    },
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("imageFile");

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
