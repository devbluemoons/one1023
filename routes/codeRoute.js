const router = require("express").Router();

const codeController = require("../controllers/codeController");

router.post("/", codeController.create);
router.get("/:_id", codeController.findById);
router.put("/", codeController.update);
router.delete("/", codeController.delete);

module.exports = router;
