"use strict";

const Member = require("../models/memberSchema");
const Paginator = require("../middlewares/paginator");

module.exports = {
    save(param) {
        const formData = this.makeFormData(param);
        return Member(formData)
            .save()
            .catch(e => console.error(e));
    },

    async findAll() {
        const memberRecord = await Member.find().catch(e => console.error(e));
        return memberRecord;
    },

    async find(param) {
        const query = this.makeQuery(param);
        const memberRecord = await Member.find({ ...query.searchCondition })
            .populate("family")
            .sort({ _id: -1 }) // descending
            .skip(query.pagingCondition.skip) // skip data order
            .limit(query.pagingCondition.limit) // size per a page
            .catch(e => console.error(e));

        const totalCount = await Member.countDocuments({ ...query.searchCondition }).catch(e => console.error(e));
        const paginator = new Paginator(totalCount, param.limit, param.page);

        return { result: memberRecord, paginator };
    },

    async findDetailById(param) {
        const id = param.id;
        const memberRecord = await Member.findById(id)
            .populate({ path: "family", populate: "memberId" })
            .populate({ path: "group", select: "name" })
            .populate({ path: "position", select: "name" })
            .populate({ path: "service", select: "name" });

        return memberRecord;
    },

    async findById(param) {
        const id = param.id;
        const memberRecord = await Member.findById(id).populate({ path: "family", populate: "memberId" });
        return memberRecord;
    },

    async findByIdAndUpdate(param) {
        const formData = this.makeFormData(param);
        const memberRecord = await Member.findByIdAndUpdate(formData._id, formData, { new: true }).catch(e => console.error(e));
        return memberRecord;
    },

    makeFormData(data) {
        if (!data) {
            return false;
        }
        const result = {
            name: data.name,
            contact1: data.contact1,
            contact2: data.contact2,
            contact3: data.contact3,
            address1: data.address1,
            address2: data.address2,
            zipCode: data.zipCode,
            gender: data.gender,
            birthday: data.birthday,
            married: data.married,
            faithState: data.faithState,
            joinDate: data.joinDate,
            email: data.email,
            job: data.job,
            baptism: data.baptism,
            group: data.group,
            position: data.position,
            service: data.service,
            attendance: data.attendance,
        };

        if (data.family) {
            result.family = data.family;
        }

        if (data._id) {
            result._id = data._id;
        }
        if (data.imagePath) {
            result.imagePath = data.imagePath;
        }

        return result;
    },

    // make search query
    // option01 : set pattern like condition
    // option02 : it's not important that value is upper case or lower case
    makeQuery(query) {
        const searchCondition = {};
        const pagingCondition = {};

        // set search parameter
        if (query.name) {
            searchCondition.name = new RegExp(query.name, "i");
        }
        if (query.address) {
            searchCondition.address1 = new RegExp(query.address, "i");
        }
        if (query.gender) {
            searchCondition.gender = new RegExp(query.gender, "i");
        }
        if (query.generation) {
            searchCondition.generation = new RegExp(query.generation, "i");
        }
        if (query.married) {
            searchCondition.married = new RegExp(query.married, "i");
        }
        if (query.faithState) {
            searchCondition.faithState = new RegExp(query.faithState, "i");
        }
        if (query.group) {
            searchCondition.group = query.group;
        }
        if (query.position) {
            searchCondition.position = query.position;
        }
        if (query.service) {
            searchCondition.service = query.service;
        }
        if (query.school) {
            searchCondition.school = query.school;
        }

        // set paging parameter
        if (query.page) {
            pagingCondition.skip = Number((query.page - 1) * query.limit);
        }
        if (query.limit) {
            pagingCondition.limit = Number(query.limit);
        }

        return {
            searchCondition,
            pagingCondition,
        };
    },
};
