const router = require("express").Router();

const memberController = require("../controllers/memberController");

router.post("/create", memberController.create);
router.get("/count", memberController.count);
router.get("/", memberController.list);
router.get("/:id", memberController.view);
router.put("/edit", memberController.edit);

module.exports = router;
