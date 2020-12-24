"use strict";

const MemberService = require("../service/memberService");
const uploadFile = require("../middlewares/uploadFile");

module.exports = {
    register: (req, res, next) => {
        res.render("pages/member/register");
    },
    list: (req, res, next) => {
        res.render("pages/member/list");
    },
    view: (req, res, next) => {
        res.render("pages/member/view");
    },
    create: async (req, res, next) => {
        // upload File
        await uploadFile(req, res);

        if (req.file) {
            req.body.imagePath = req.file.path;
        }

        const param = req.body;
        const memberRecord = await MemberService.save(param);
        res.send(memberRecord);
    },
    find: async (req, res, next) => {
        const param = req.query;
        const memberRecord = await MemberService.find(param);
        res.send(memberRecord);
    },
    findAll: async (req, res, next) => {
        const param = req.query;
        const memberRecord = await MemberService.findAll();
        res.send(memberRecord);
    },
    findById: async (req, res, next) => {
        const param = req.params;
        const memberRecord = await MemberService.findById(param);
        res.send(memberRecord);
    },
    detail: async (req, res, next) => {
        const param = req.params;
        const memberRecord = await MemberService.findDetailById(param);
        res.send(memberRecord);
    },
    update: async (req, res, next) => {
        // upload File
        await uploadFile(req, res);

        if (req.file) {
            req.body.imagePath = req.file.path;
        }

        const param = req.body;
        const memberRecord = await MemberService.findByIdAndUpdate(param);
        res.send(memberRecord);
    },
};
