"use strict";

const router = require("express").Router();
const controller = require("../controllers/memberController");

router.get("/register", controller.register);
router.get("/list", controller.list);
router.get("/view", controller.view);

router.get("/", controller.find);
router.get("/:id", controller.findById);
router.get("/view/:id", controller.detail);
router.post("/", controller.create);
router.put("/", controller.update);

module.exports = router;
