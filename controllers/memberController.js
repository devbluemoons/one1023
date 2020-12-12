const MemberService = require("../service/memberService");
const uploadFile = require("../middlewares/uploadFile");

module.exports = {
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
    list: async (req, res, next) => {
        const param = req.query;
        const memberRecord = await MemberService.find(param);
        res.send(memberRecord);
    },
    view: async (req, res, next) => {
        const param = req.params;
        const memberRecord = await MemberService.findById(param);
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
