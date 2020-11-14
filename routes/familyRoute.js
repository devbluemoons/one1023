const router = require("express").Router();

const familyController = require("../controllers/familyController");

router.post("/", familyController.create);
router.get("/", familyController.list);
router.get("/:id", familyController.view);
router.put("/", familyController.update);

module.exports = router;
