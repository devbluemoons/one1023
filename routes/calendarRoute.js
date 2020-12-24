"use strict";

const router = require("express").Router();
const controller = require("../controllers/calendarController");

router.post("/", controller.create);
router.get("/", controller.find);
router.put("/", controller.update);
router.delete("/", controller.delete);

module.exports = router;
