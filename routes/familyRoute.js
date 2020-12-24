"use strict";

const router = require("express").Router();
const controller = require("../controllers/familyController");

router.post("/", controller.create);
router.get("/:_id", controller.findById);
router.get("/member/:memberId", controller.findByMemberId);
router.put("/", controller.update);
router.delete("/", controller.delete);

module.exports = router;
