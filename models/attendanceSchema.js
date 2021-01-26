"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        count: {
            type: [Number],
            required: true,
        },
        date: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "attendances",
    }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
