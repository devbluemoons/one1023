"use strict";

const router = require("express").Router();
const controller = require("../controllers/codeController");

router.post("/", controller.create);
router.get("/division", controller.findByDivision);
router.get("/division/id", controller.findByDivisionAndId);
router.get("/division/name", controller.findByDivisionAndName);
router.put("/", controller.update);
router.delete("/", controller.delete);

module.exports = router;
