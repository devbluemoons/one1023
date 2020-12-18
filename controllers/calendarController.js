const CalendarService = require("../service/calendarService");

module.exports = {
    create: async (req, res, next) => {
        const param = req.body;
        const calendarRecord = await CalendarService.save(param);
        res.send(calendarRecord);
    },

    find: async (req, res, next) => {
        const param = req.query;
        const calendarRecord = await CalendarService.find(param);
        res.send(calendarRecord);
    },

    update: async (req, res, next) => {
        const param = req.body;
        const calendarRecord = await CalendarService.findByIdAndUpdate(param);
        res.send(calendarRecord);
    },

    delete: async (req, res, next) => {
        const param = req.body;
        const calendarRecord = await CalendarService.findByIdAndDelete(param);
        res.send(calendarRecord);
    },
};
