"use strict";

const router = require("express").Router();

const loginController = require("../controllers/loginController");

router.get("/", loginController.login);
router.post("/", loginController.authenticate);

module.exports = router;
