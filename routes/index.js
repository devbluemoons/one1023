"use strict";

const loginController = require("../controllers/loginController");
const router = require("express").Router();

const loginRoute = require("./loginRoute");
const fileRoute = require("./fileRoute");
const calendarRoute = require("./calendarRoute");
const memberRoute = require("./memberRoute");
const familyRoute = require("./familyRoute");
const codeRoute = require("./codeRoute");
const relationshipRoute = require("./relationshipRoute");
const systemRoute = require("./systemRoute");

router.get("/login", (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        req.flash("error", "[ ! ] Invalid login information");
        res.render("login", { layout: false });
    }
});

/** 개발할 동안만 임시로 로그인 기능 주석 처리  */
/** 배포할 때는 다시 주석해제 해야 한다 */
// router.use("/", loginController.isAuthenticated, loginRoute);
router.use("/", loginRoute);
router.use("/file", fileRoute);
router.use("/calendar", calendarRoute);
router.use("/member", memberRoute);
router.use("/family", familyRoute);
router.use("/code", codeRoute);
router.use("/relationship", relationshipRoute);
router.use("/system", systemRoute);

module.exports = router;
