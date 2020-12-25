"use strict";

const router = require("express").Router();

const loginRoute = require("./loginRoute");
const fileRoute = require("./fileRoute");
const calendarRoute = require("./calendarRoute");
const memberRoute = require("./memberRoute");
const familyRoute = require("./familyRoute");
const codeRoute = require("./codeRoute");
const relationshipRoute = require("./relationshipRoute");

// router.use("/", 모든 경로에 적용되는 규칙이기 때문에 뭔가 조치가 필요);

// .get("/") 과 .use("/") 차이를 꼭 알아내야 한다
// 이것이 route 를 다루는 키포인트가 될 것이다
// google 에서 최대한 많이 검색해서 정보를 얻고 이해해야 함

router.use("/", loginRoute);
router.use("/file", fileRoute);
router.use("/calendar", calendarRoute);
router.use("/member", memberRoute);
router.use("/family", familyRoute);
router.use("/code", codeRoute);
router.use("/relationship", relationshipRoute);

module.exports = router;
