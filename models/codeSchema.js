const mongoose = require("mongoose");

const { Schema } = mongoose;

const codeSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
        division: {
            type: String,
            required: true,
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
        collection: "codes",
    }
);

module.exports = mongoose.model("Code", codeSchema);
