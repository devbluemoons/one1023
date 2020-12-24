"use strict";

const router = require("express").Router();

router.get("/view", function (req, res, next) {
    res.render("pages/relationship/view");
});

module.exports = router;
