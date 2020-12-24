"use strict";

const router = require("express").Router();
const controller = require("../controllers/loginController");

router.get("/", controller.login);
router.post("/", controller.authenticate, controller.redirectView);

module.exports = router;
