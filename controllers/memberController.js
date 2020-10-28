const Member = require("../models/memberSchema");
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
        const member = makeFormData(req.body);

        // save data
        member
            .save()
            .then((savedDocument) => {
                if (savedDocument) {
                    res.send(savedDocument);
                }
            })
            .catch((error) => {
                console.error(error.message);
                next(error);
            });
    },
    find: (req, res, next) => {
        // set parameter
        const params = makeParams(req.query);

        Member.find({ ...params.searchCondition })
            .sort({ _id: -1 }) // descending
            .skip(params.pagingCondition.skip) // skip data order
            .limit(params.pagingCondition.limit) // size per a page
            .exec()
            .then((result) => {
                res.send(result);
            });
    },
    edit: (req, res, next) => {
        console.log("mission success~");
    },
    count: (req, res, next) => {
        Member.countDocuments()
            .exec()
            .then((totalCount) => {
                res.json(new Paginator(totalCount, req.query.limit, req.query.page));
            });
    },
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) {
            res.redirect(redirectPath);
        } else {
            next();
        }
    },
};

function makeFormData(data) {
    if (data) {
        return new Member({
            name: data.name,
            contact: {
                contact1: data.contact1,
                contact2: data.contact2,
                contact3: data.contact3,
            },
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
            imagePath: data.imagePath,
        });
    }
    return new Error("data is empty!");
}

// make search parameter
// option01 : set pattern like condition
// option01 : it's not important that value is upper case or lower case
function makeParams(query) {
    const searchCondition = {};
    const pagingCondition = {};

    // set only search parameter
    if (query.name) {
        searchCondition.name = new RegExp(query.name, "i");
    }
    if (query.address) {
        searchCondition.address = new RegExp(query.address, "i");
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

    // set only paging parameter
    if (query.skip) {
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
