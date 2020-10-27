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
    find: (req, res, next) => {
        // set parameter

        const params = makeParams(req.query);
        console.log(params);
        Member.find({})
            //     // .where("name")
            //     // .equals(params.name)
            // .where("name")
            // .equals(params.name)
            // .where("name")
            // .equals(params.name)
            // .where("name")
            // .equals(params.name)
            // .where("name")
            // .equals(params.name)
            // .where("name")
            // .equals(params.name)
            .sort({ _id: -1 }) // descending
            .skip(params.skip) // skip data order
            .limit(params.limit) // size per a page
            .exec()
            .then(result => {
                res.send(result);
            });
    },
    edit: (req, res, next) => {
        console.log("mission success~");
    },
    count: (req, res, next) => {
        Member.countDocuments()
            .exec()
            .then(totalCount => {
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

function makeParams(query) {
    const skip = Number((query.page - 1) * query.limit);
    const limit = Number(query.limit);

    const name = Number(query.name);
    const address = Number(query.address);
    const gender = Number(query.gender);
    const generation = Number(query.generation);
    const married = Number(query.married);
    const faithState = Number(query.faithState);

    return {
        skip,
        limit,
        name,
        address,
        gender,
        generation,
        married,
        faithState,
    };
}
