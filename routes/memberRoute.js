const router = require("express").Router();
const multer = require("multer");

const memberController = require("../controllers/memberController");

router.post("/create", memberController.create);
router.put("/edit", memberController.edit);
router.get("/find", memberController.find);
router.get("/count", memberController.count);

module.exports = router;
