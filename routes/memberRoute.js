const router = require("express").Router();

const memberController = require("../controllers/memberController");

router.post("/", memberController.create);
router.get("/", memberController.list);
router.get("/:id", memberController.view);
router.put("/", memberController.update);

module.exports = router;
