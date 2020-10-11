// member Shema
const Member = require("../models/memberSchema");

module.exports = {
    create: (req, res, next) => {
        console.log(req.body);

        return false;

        const member = makeFormData(req.body);

        member
            .save()
            .then(() => {
                res.render("/");
            })
            .catch(error => {
                console.error(error);
            });
    },
    find: (req, res, next) => {
        console.log(req);
        console.log("mission success~");
    },
    edit: (req, res, next) => {
        console.log(req);
        console.log("mission success~");
    },
};

function makeFormData(data) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
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
            joinData: data.joinData,
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
    return null;
}
