const Family = require("../models/familySchema");

module.exports = {
    save(param) {
        return Family.save(param);
    },
    findOne(param) {
        return Family.findOne(param);
    },
    findByIdAndUpdate(param) {
        return Family.findByIdAndUpdate(param._id, param, { new: true });
    },
    findByIdAndDelete(param) {
        return Family.findByIdAndDelete({ _id: req.body._id });
    },
};
