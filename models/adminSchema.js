"use strict";

const passportLocalMongoose = require("passport-local-mongoose");
const Member = require("./memberSchema");

const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        contact: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            require: true,
        },
        question: {
            type: String,
            require: true,
        },
        answer: {
            type: String,
            require: true,
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
        updatedId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "admins",
    }
);

adminSchema.plugin(passportLocalMongoose, {
    usernameField: "contact",
});

module.exports = mongoose.model("Admin", adminSchema);
