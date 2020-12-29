"use strict";

const router = require("express").Router();
const controller = require("../controllers/loginController");

router.get("/", controller.main);
router.get("/login", controller.login);
router.post("/login", controller.authenticate);
router.get("/logout", controller.logout, controller.redirectView);

module.exports = router;
