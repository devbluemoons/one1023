"use strict";

const router = require("express").Router();
const multer = require("multer");
const fileController = require("../controllers/fileController");

router.post("/upload", uploadSingleFile(), fileController.upload);
router.get("/find", fileController.find);
router.put("/replace", fileController.replace);
router.delete("/delete", fileController.delete);

module.exports = router;

// upload single file
function uploadSingleFile() {
    const storage = multer.diskStorage({
        // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },
        // cb 콜백함수를 통해 전송된 파일 이름 설정
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    const upload = multer({ storage: storage });

    return upload.single("imageFile");
}
