"use strict";

const Attendance = require("../models/attendanceSchema");
const Admin = require("../models/adminSchema");
const Paginator = require("../middlewares/paginator");

module.exports = {
    save(param) {
        return Attendance(param)
            .save()
            .catch(e => console.error(e));
    },

    findOne(param) {
        return Attendance.findOne(param).catch(e => console.error(e));
    },

    async findAll() {
        const adminRecord = await Admin.find().catch(e => console.error(e));
        const totalCount = await Admin.countDocuments().catch(e => console.error(e));

        const paginator = new Paginator(totalCount, null, null);
        return { result: adminRecord, paginator };
    },
};
