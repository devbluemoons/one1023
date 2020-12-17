const mongoose = require("mongoose");

const { Schema } = mongoose;

const calendarSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
        },
        valid: {
            type: String,
            required: true,
            default: "01", // means: use
        },
        updatedId: String,
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "calendars",
    }
);

module.exports = mongoose.model("Calendar", calendarSchema);
