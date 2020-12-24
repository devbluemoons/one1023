"use strict";

const router = require("express").Router();

/* GET page. */
router.get("/", function (req, res, next) {
    // get session
    const session = req.session;

    if (session) {
        res.render("dashboard");
    } else {
        res.render("login", { layout: false });
    }
});
router.get("/login", function (req, res, next) {
    res.render("login", { layout: false });
});
router.get("/member/register", function (req, res, next) {
    res.render("pages/member/register");
});
router.get("/member/list", function (req, res, next) {
    res.render("pages/member/list");
});
router.get("/member/view", function (req, res, next) {
    res.render("pages/member/view");
});
router.get("/relationship/view", function (req, res, next) {
    res.render("pages/relationship/view");
});

/* Controller Router */
router.use("/login", require("./loginRoute"));
router.use("/file", require("./fileRoute"));
router.use("/calendar", require("./calendarRoute"));
router.use("/member", require("./memberRoute"));
router.use("/family", require("./familyRoute"));
router.use("/code", require("./codeRoute"));

module.exports = router;
