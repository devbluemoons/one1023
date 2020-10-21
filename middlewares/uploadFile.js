const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // make file name

        const name = req.body.name;
        const birthday = req.body.birthday;
        const fileType = file.mimetype.split("/")[1];

        const fileName = `${name}_${birthday}.${fileType}`;
        console.log(req.body);
        cb(null, fileName);
    },
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("imageFile");

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
