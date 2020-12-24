"use strict";

const router = require("express").Router();

const memberController = require("../controllers/memberController");

router.get("/register", memberController.register);
router.get("/list", memberController.list);
router.get("/view", memberController.view);

router.get("/", memberController.find);
router.get("/:id", memberController.findById);
router.get("/view/:id", memberController.detail);
router.post("/", memberController.create);
router.put("/", memberController.update);

module.exports = router;
