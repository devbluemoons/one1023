const mongoose = require("mongoose");

const { Schema } = mongoose;

const familySchema = new Schema(
    {
        memberId: {
            type: Array,
            unique: true,
            required: true,
        },
        updatedId: String,
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "families",
    }
);

module.exports = mongoose.model("Family", familySchema);
