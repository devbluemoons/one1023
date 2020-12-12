const Member = require("../models/memberSchema");
const Family = require("../models/familySchema");
const Paginator = require("../middlewares/paginator");
const uploadFile = require("../middlewares/uploadFile");

module.exports = {
    create: async (req, res, next) => {
        // upload File
        await uploadFile(req, res);

        if (req.file) {
            req.body.imagePath = req.file.path;
        }

        // make form data
        const formData = makeFormData(req.body);

        // save data
        Member(formData)
            .save()
            .then(savedDocument => {
                if (savedDocument) {
                    res.send(savedDocument);
                }
            })
            .catch(error => {
                console.error(error.message);
                next(error);
            });
    },
    list: (req, res, next) => {
        // set parameter
        const query = makeQuery(req.query);
        console.log(query);
        Member.find({ ...query.searchCondition })
            .sort({ _id: -1 }) // descending
            .skip(query.pagingCondition.skip) // skip data order
            .limit(query.pagingCondition.limit) // size per a page
            .then(async data => {
                // make family group
                const result = await makeFamilyGroupList(data);

                // make paginator
                Member.countDocuments({ ...query.searchCondition }).then(totalCount => {
                    const paginator = new Paginator(totalCount, req.query.limit, req.query.page);
                    res.send({ result, paginator });
                });
            });
    },
    view: (req, res, next) => {
        // set parameter
        const params = makeParams(req.params);
        Member.findById(params).then(async data => {
            // make family group
            const result = await makeFamilyGroup(data);
            res.send(result);
        });
    },
    update: async (req, res, next) => {
        // upload File
        await uploadFile(req, res);

        if (req.file) {
            req.body.imagePath = req.file.path;
        }
        // make form data
        const formData = makeFormData(req.body);

        // update data
        Member.findByIdAndUpdate(formData._id, formData, { new: true })
            .then(updatedDocument => {
                if (updatedDocument) {
                    res.send(updatedDocument);
                }
            })
            .catch(error => {
                console.error(error.message);
                next(error);
            });
    },
};

function makeFormData(data) {
    if (data) {
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
            role: data.role,
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
    }
}

// make family group
async function makeFamilyGroup(data) {
    if (!data.family) {
        return data;
    }

    const family = await Family.findById(data.family);

    if (family) {
        data.familyGroup = family.memberId;
    }

    return data;
}

// make family group list
async function makeFamilyGroupList(data) {
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
}

// make search query
// option01 : set pattern like condition
// option02 : it's not important that value is upper case or lower case
function makeQuery(query) {
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
}

function makeParams(params) {
    if (params.id) {
        return params.id;
    }
}
