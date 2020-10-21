const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const memberSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
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
                id: Schema.Types.ObjectId,
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

// binding paginate
memberSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Member", memberSchema);
