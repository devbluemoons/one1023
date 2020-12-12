const CodeService = require("../service/codeService");
const Code = require("../models/codeSchema");

module.exports = {
    create: async (req, res, next) => {
        const param = req.body;
        const codeRecord = await CodeService.save(param);
        res.send(codeRecord);
    },

    findByDivision: async (req, res, next) => {
        const param = req.query;
        const codeRecord = await CodeService.findByDivision(param);
        res.send(codeRecord);
    },

    findByDivisionAndId: async (req, res, next) => {
        const param = req.query;
        const codeRecord = await CodeService.findOne(param);
        res.send(codeRecord);
    },

    findByDivisionAndName: async (req, res, next) => {
        const param = req.query;
        const codeRecord = await CodeService.findOne(param);
        res.send(codeRecord);
    },

    update: async (req, res, next) => {
        const param = req.body;
        const codeRecord = await CodeService.findByIdAndUpdate(param);
        res.send(codeRecord);
    },

    delete: async (req, res, next) => {
        const param = req.body;
        const codeRecord = await CodeService.findByIdAndDelete(param);
        res.send(codeRecord);
    },
};
