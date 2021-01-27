"use strict";

require("dotenv").config();

const Attendance = require("../models/attendanceSchema");
const Admin = require("../models/adminSchema");
const Paginator = require("../middlewares/paginator");

module.exports = {
    save(param) {
        return Attendance(param)
            .save()
            .catch(e => console.error(e));
    },

    addAdmin(req, res, next) {
        Admin.register(req.body, process.env.DEFAULT_PASSWORD, (e, admin) => {
            if (admin) {
                req.flash("success", `${req.body.name}'s account created successfully!`);
                res.redirect("/system");
            } else {
                req.flash("error", `Failed to create user account because: ${e.message}.`);
                res.redirect("/system");
            }
        });
    },

    findOne(param) {
        return Attendance.findOne(param).catch(e => console.error(e));
    },

    async findAll() {
        // get all administrator account except engineer account
        const adminRecord = await Admin.find({ name: { $ne: "Engineer" } })
            .populate({ path: "member", populate: ["group", "position"] })
            .catch(e => console.error(e));

        const totalCount = await Admin.countDocuments().catch(e => console.error(e));

        const paginator = new Paginator(totalCount, null, null);
        return { result: adminRecord, paginator };
    },

    findByIdAndDelete(param) {
        console.log(param);
        return Admin.findByIdAndDelete({ _id: param._id }).catch(e => console.error(e));
    },
};
