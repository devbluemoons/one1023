const Member = require("../models/memberSchema");
const Family = require("../models/familySchema");
const Paginator = require("../middlewares/paginator");

module.exports = {
    save(param) {
        const formData = this.makeFormData(param);
        return Member(formData).save();
    },

    async find(param) {
        const query = this.makeQuery(param);
        const memberRecord = await Member.find({ ...query.searchCondition })
            .sort({ _id: -1 }) // descending
            .skip(query.pagingCondition.skip) // skip data order
            .limit(query.pagingCondition.limit); // size per a page

        const result = await this.makeFamilyGroupList(memberRecord);
        const totalCount = await Member.countDocuments({ ...query.searchCondition });
        const paginator = new Paginator(totalCount, query.limit, query.page);

        return { result, paginator };
    },
    async findById(param) {
        const id = param.id;
        const memberRecord = await Member.findById(id);
        const result = await this.makeFamilyGroup(memberRecord);

        return result;
    },
    async findByIdAndUpdate(param) {
        const formData = makeFormData(param);
        const memberRecord = await Member.findByIdAndUpdate(formData._id, formData, { new: true });
        return { result: memberRecord };
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

    // make family group
    async makeFamilyGroup(data) {
        if (!data.family) {
            return data;
        }

        const family = await Family.findById(data.family);

        if (family) {
            data.familyGroup = family.memberId;
        }

        return data;
    },

    // make family group list
    async makeFamilyGroupList(data) {
        const result = [];

        for (const item of data) {
            // has no family
            if (!item.family) {
                result.push(item);
                continue;
            }
            // has family
            const family = await Family.findById(item.family);

            if (family) {
                item.familyGroup = family.memberId;
            }
            result.push(item);
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
            searchCondition.group = new RegExp(query.group, "i");
        }
        if (query.position) {
            searchCondition.position = new RegExp(query.position, "i");
        }
        if (query.service) {
            searchCondition.service = new RegExp(query.service, "i");
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
