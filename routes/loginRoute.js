"use strict";

const router = require("express").Router();
const controller = require("../controllers/loginController");

router.get("/", controller.isAuthenticated, controller.redirectView);
router.post("/login", controller.authenticate);
router.get("/login", controller.login);
router.get("/logout", controller.logout, controller.redirectView);

module.exports = router;
