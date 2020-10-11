const router = require("express").Router();

const memberController = require("../controllers/memberController");

router.post("/create", memberController.create);
router.get("/list", memberController.find);
router.put("/edit", memberController.edit);

module.exports = router;
