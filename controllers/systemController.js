"use strict";

const SystemService = require("../service/systemService");

module.exports = {
    create: async (req, res, next) => {
        const param = req.body;
        const attendanceRecord = await SystemService.save(param);
        res.send(attendanceRecord);
    },

    findOne: async (req, res, next) => {
        const param = req.body;
        const attendanceRecord = await SystemService.findOne(param);
        res.send(attendanceRecord);
    },

    findAll: async (req, res, next) => {
        const adminRecord = await SystemService.findAll();
        res.send(adminRecord);
    },
};
