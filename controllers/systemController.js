"use strict";

const SystemService = require("../service/systemService");

module.exports = {
    create: async (req, res, next) => {
        const param = req.body;
        const attendanceRecord = await SystemService.save(param);
        res.send(attendanceRecord);
    },

    addAdmin: (req, res, next) => {
        SystemService.addAdmin(req, res, next);
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

    findByIdAndDelete: async (req, res, next) => {
        const param = req.body;
        const adminRecord = await SystemService.findByIdAndDelete(param);
        res.send(adminRecord);
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
};
