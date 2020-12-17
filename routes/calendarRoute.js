const router = require("express").Router();

const calendarController = require("../controllers/calendarController");

router.post("/", calendarController.create);
router.get("/:start", calendarController.find);
router.put("/", calendarController.update);
router.delete("/", calendarController.delete);

module.exports = router;
