const mongoose = require("mongoose");

const memberSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            contact1: {
                type: Number,
                required: true,
            },
            contact2: {
                type: Number,
                required: true,
            },
            contact3: {
                type: Number,
                required: true,
            },
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
            type: String,
        },
        role: {
            type: String,
        },
        service: {
            type: String,
        },
        attendence: {
            type: String,
        },
        imagePath: {
            type: String,
        },
        opinions: [
            {
                id: mongoose.Schema.Types.ObjectId,
            },
            {
                writer: String,
            },
        ],
    },
    {
        timestamps: true,
    },
    {
        collection: "members",
    }
);

module.exports = mongoose.model("Member", memberSchema);
