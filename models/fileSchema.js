"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: Number,
            required: true,
        },
        uploader: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
    {
        collection: "files",
    }
);

module.exports = mongoose.model("File", fileSchema);
