"use strict";

const router = require("express").Router();

router.get("/", function (req, res, next) {
    // get session
    const session = req.session.loggedIn;

    if (session) {
        res.render("dashboard");
    } else {
        res.render("login", { layout: false });
    }
});

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

module.exports = router;
