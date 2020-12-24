"use strict";

const router = require("express").Router();
const controller = require("../controllers/memberController");

router.get("/register", controller.register);
router.get("/list", controller.list);
router.get("/view", controller.view);

router.get("/", controller.find);
router.get("/all", controller.findAll);
router.get("/:id/one", controller.findById);
router.get("/:id/detail", controller.detail);
router.post("/", controller.create);
router.put("/", controller.update);

module.exports = router;
