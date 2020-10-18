const router = require("express").Router();
const multer = require("multer");

// set multer (for receiving request.body from "FormData")
// router.use("/", multer().any());

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
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

/* Controller Router */
router.use("/file", require("../routes/file"));
router.use("/member", require("./member"));

module.exports = router;
