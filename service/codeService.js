const Code = require("../models/codeSchema");
const Member = require("../models/memberSchema");
const Paginator = require("../middlewares/paginator");

module.exports = {
    save(param) {
        return Code(param).save();
    },

    findOne(param) {
        return Code.findOne(param);
    },

    findByIdAndUpdate(param) {
        return Code.findByIdAndUpdate(param._id, param, { new: true });
    },

    findByIdAndDelete(param) {
        return Code.findByIdAndDelete({ _id: param._id });
    },

    async findByDivision(param) {
        const codeRecord = await Code.find(param);
        const result = await this.makeRelatedCodeCount(codeRecord);

        const totalCount = await Code.countDocuments();
        const paginator = new Paginator(totalCount, param.limit, param.page);

        return { result, paginator };
    },

    async makeRelatedCodeCount(data) {
        const result = [];

        for (const item of data) {
            // set param
            const param = {};
            const key = item.division;
            param[key] = item._id;

            const list = await Member.find(param);

            if (list.length > 0) {
                item.count = list.length;
            }

            result.push(item);
        }

        return result;
    },
};
