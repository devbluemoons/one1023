"use strict";

const Attendance = require("../models/attendanceSchema");

module.exports = {
    save(param) {
        return Attendance(param)
            .save()
            .catch(e => console.error(e));
    },
    findOne(param) {
        return Attendance.findOne(param).catch(e => console.error(e));
    },
};
