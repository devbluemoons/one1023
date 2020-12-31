"use strict";

const router = require("express").Router();
const controller = require("../controllers/systemController");

router.get("/", (req, res, next) => {
    res.render("pages/system");
});

router.post("/worship/attendance", controller.create);
router.get("/worship/attendance", controller.findOne);
router.get("/admin", controller.findAll);

module.exports = router;
