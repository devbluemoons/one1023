const Family = require("../models/familySchema");

module.exports = {
    save(param) {
        return Family(param)
            .save()
            .catch(e => console.error(e));
    },
    findOne(param) {
        return Family.findOne(param)
            .populate("memberId")
            .catch(e => console.error(e));
    },
    findByIdAndUpdate(param) {
        return Family.findByIdAndUpdate(param._id, param, { new: true }).catch(e => console.error(e));
    },
    findByIdAndDelete(param) {
        return Family.findByIdAndDelete({ _id: req.body._id }).catch(e => console.error(e));
    },
};
