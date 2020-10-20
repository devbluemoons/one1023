const router = require("express").Router();

const memberController = require("../controllers/memberController");

router.post("/create", memberController.create);
router.put("/edit", memberController.edit);
router.get("/find", memberController.find);

module.exports = router;
