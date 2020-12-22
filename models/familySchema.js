const mongoose = require("mongoose");

const { Schema } = mongoose;

const familySchema = new Schema(
    {
        memberId: [
            {
                type: Schema.Types.ObjectId,
                ref: "Member",
                required: true,
            },
        ],
        updatedId: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            // required: true,
        },
    },
    {
        timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    },
    {
        collection: "families",
    }
);

module.exports = mongoose.model("Family", familySchema);
