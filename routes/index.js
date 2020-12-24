"use strict";

const router = require("express").Router();

const loginRoute = require("./login");
const fileRoute = require("./file");
const calendarRoute = require("./calendar");
const memberRoute = require("./member");
const familyRoute = require("./family");
const codeRoute = require("./code");
const relationshipRoute = require("./relationship");

router.use("/login", loginRoute);
router.use("/file", fileRoute);
router.use("/calendar", calendarRoute);
router.use("/member", memberRoute);
router.use("/family", familyRoute);
router.use("/code", codeRoute);
router.use("/relationship", relationshipRoute);

router.get("/", function (req, res, next) {
    if (req.session.loggedIn) {
        res.render("dashboard");
    } else {
        res.render("login", { layout: false });
    }
});

module.exports = router;
