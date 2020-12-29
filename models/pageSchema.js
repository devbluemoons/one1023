"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const pageSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            require: true,
        },
        valid: {
            type: String,
            required: true,
            default: "01", // means: use
        },
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "pages",
    }
);

module.exports = mongoose.model("Page", pageSchema);
