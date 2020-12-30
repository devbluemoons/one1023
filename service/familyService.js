"use strict";

const Family = require("../models/familySchema");

module.exports = {
    create(param) {
        return Family(param)
            .save()
            .then(family => family.populate("members").execPopulate())
            .catch(e => console.error(e));
    },

    findOne(param) {
        return Family.findOne(param)
            .populate("members")
            .catch(e => console.error(e));
    },

    findByIdAndUpdate(param) {
        return Family.findByIdAndUpdate(param._id, param, { new: true })
            .populate("members")
            .catch(e => console.error(e));
    },

    findByIdAndDelete(param) {
        return Family.findByIdAndDelete({ _id: param._id })
            .populate("members")
            .catch(e => console.error(e));
    },
};
