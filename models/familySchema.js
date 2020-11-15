const mongoose = require("mongoose");

const { Schema } = mongoose;

const familySchema = new Schema(
    {
        name: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "family",
    }
);

module.exports = mongoose.model("Family", familySchema);
