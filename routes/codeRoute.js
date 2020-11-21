const router = require("express").Router();

const codeController = require("../controllers/codeController");

router.post("/", codeController.create);
router.get("/:division", codeController.findByDivision);
router.get("/division/name", codeController.findByDivisionAndName);
router.put("/", codeController.update);
router.delete("/", codeController.delete);

module.exports = router;
