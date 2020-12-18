const Calendar = require("../models/calendarSchema");

module.exports = {
    save(param) {
        return Calendar(param)
            .save()
            .catch(e => console.error(e));
    },

    find(param) {
        return Calendar.find({ start: { $gte: param.startDt, $lte: param.endDt } }).catch(e => console.error(e));
    },

    findByIdAndUpdate(param) {
        return Calendar.findByIdAndUpdate(param._id, param, { new: true }).catch(e => console.error(e));
    },

    findByIdAndDelete(param) {
        return Calendar.findByIdAndDelete({ _id: param._id }).catch(e => console.error(e));
    },
};
