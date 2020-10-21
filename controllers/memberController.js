const Member = require("../models/memberSchema");
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
        Member.find({})
            .sort({ _id: -1 }) // descending
            .exec()
            .then(result => {
                res.send(result);
            });
    },
    edit: (req, res, next) => {
        console.log(req);
        console.log("mission success~");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
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
