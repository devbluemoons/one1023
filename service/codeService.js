const Code = require("../models/codeSchema");
const Member = require("../models/memberSchema");
const Paginator = require("../middlewares/paginator");

module.exports = {
    save(param) {
        return Code(param)
            .save()
            .catch(e => console.error(e));
    },

    findOne(param) {
        return Code.findOne(param).catch(e => console.error(e));
    },

    findByIdAndUpdate(param) {
        return Code.findByIdAndUpdate(param._id, param, { new: true }).catch(e => console.error(e));
    },

    findByIdAndDelete(param) {
        return Code.findByIdAndDelete({ _id: param._id }).catch(e => console.error(e));
    },

    async findByDivision(param) {
        const codeRecord = await Code.find(param);
        const result = await this.makeRelatedCodeCount(codeRecord);

        const totalCount = await Code.countDocuments(param).catch(e => console.error(e));
        const paginator = new Paginator(totalCount, param.limit, param.page);

        return { result, paginator };
    },

    async makeRelatedCodeCount(data) {
        const result = [];

        for (const item of data) {
            // set param
            const param = {
                [item.division]: item._id,
            };

            const memberList = await Member.find(param);

            if (memberList.length > 0) {
                item.count = memberList.length;
            }

            result.push(item);
        }

        return result;
    },
};
