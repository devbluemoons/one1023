"use strict";

const router = require("express").Router();

const familyController = require("../controllers/familyController");

router.post("/", familyController.create);
router.get("/:_id", familyController.findById);
router.get("/member/:memberId", familyController.findByMemberId);
router.put("/", familyController.update);
router.delete("/", familyController.delete);

module.exports = router;
