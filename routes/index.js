const router = require("express").Router();

/* GET page. */
router.get("/", function (req, res, next) {
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
router.use("/calendar", require("./calendarRoute"));
router.use("/file", require("./fileRoute"));
router.use("/member", require("./memberRoute"));
router.use("/family", require("./familyRoute"));
router.use("/code", require("./codeRoute"));

module.exports = router;
