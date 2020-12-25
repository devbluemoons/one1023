"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        contact1: {
            type: String,
            required: true,
        },
        contact2: {
            type: String,
            required: true,
        },
        contact3: {
            type: String,
            required: true,
        },
        address1: {
            type: String,
            required: true,
            trim: true,
        },
        address2: {
            type: String,
            required: true,
            trim: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            trim: true,
        },
        birthday: {
            type: String,
            required: true,
            trim: true,
        },
        married: {
            type: String,
            required: true,
            trim: true,
        },
        faithState: {
            type: String,
            required: true,
            trim: true,
        },
        joinDate: {
            type: String,
            required: true,
            trim: true,
        },
        family: {
            type: Schema.Types.ObjectId,
            ref: "Family",
        },
        email: {
            type: String,
        },
        job: {
            type: String,
        },
        baptism: {
            type: String,
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: "Code",
        },
        position: {
            type: Schema.Types.ObjectId,
            ref: "Code",
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: "Code",
        },
        attendence: {
            type: String,
        },
        imagePath: {
            type: String,
        },
        opinions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Member",
            },
        ],
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "members",
    }
);

module.exports = mongoose.model("Member", memberSchema);
