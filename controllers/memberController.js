// member Shema
const Member = require("../models/memberSchema");

module.exports = {
    create: (req, res, next) => {
        // make form data
        const member = makeFormData(req.body);
        // save data
        member
            .save()
            .then(savedDocumnet => {
                res.locals.redirect = "/register";
                res.locals.user = savedDocumnet;
                next();
            })
            .catch(error => {
                console.error(error);
            });
    },
    find: (req, res, next) => {
        Member.find({})
            .exec()
            .then(result => {
                res.send(result);
            });
    },
    edit: (req, res, next) => {
        console.log(req);
        console.log("mission success~");
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
