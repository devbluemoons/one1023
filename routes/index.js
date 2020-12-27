"use strict";

const router = require("express").Router();

const loginRoute = require("./loginRoute");
const fileRoute = require("./fileRoute");
const calendarRoute = require("./calendarRoute");
const memberRoute = require("./memberRoute");
const familyRoute = require("./familyRoute");
const codeRoute = require("./codeRoute");
const relationshipRoute = require("./relationshipRoute");

router.use("/", loginRoute);
router.use("/file", fileRoute);
router.use("/calendar", calendarRoute);
router.use("/member", memberRoute);
router.use("/family", familyRoute);
router.use("/code", codeRoute);
router.use("/relationship", relationshipRoute);

module.exports = router;
