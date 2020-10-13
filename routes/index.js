const router = require("express").Router();
const multer = require("multer");

// set multer (for receiving request.body)
router.use("/", multer().fields([]));

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});
router.get("/register", function (req, res, next) {
    res.render("pages/register");
});
router.get("/memberList", function (req, res, next) {
    res.render("pages/memberList");
});

/* Controller Router */
router.use("/member", require("../routes/memberRoute"));

module.exports = router;
