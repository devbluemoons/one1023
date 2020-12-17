const CalendarService = require("../service/calendarService");

module.exports = {
    create: async (req, res, next) => {
        const param = req.body;
        const codeRecord = await CalendarService.save(param);
        res.send(codeRecord);
    },

    find: async (req, res, next) => {
        const param = req.params;
        const codeRecord = await CalendarService.find(param);
        res.send(codeRecord);
    },

    update: async (req, res, next) => {
        const param = req.body;
        const codeRecord = await CalendarService.findByIdAndUpdate(param);
        res.send(codeRecord);
    },

    delete: async (req, res, next) => {
        const param = req.body;
        const codeRecord = await CalendarService.findByIdAndDelete(param);
        res.send(codeRecord);
    },
};
