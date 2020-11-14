const Family = require("../models/familySchema");

module.exports = {
    create: (req, res, next) => {
        // make form data
        const formData = makeFormData(req.body);

        // save data
        Family(formData)
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

        Family.find({ ...query.searchCondition }).exec();
    },
    view: (req, res, next) => {
        // set parameter
        const params = makeParams(req.params);

        Family.findById(params)
            .exec()
            .then(result => {
                res.send(result);
            });
    },
    update: (req, res, next) => {
        // make form data
        const formData = makeFormData(req.body);
        // update data
        Family.findByIdAndUpdate(formData.id, formData)
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
        };

        if (data.id) {
            result.id = data.id;
        }
        if (data.imagePath) {
            result.imagePath = data.imagePath;
        }

        return result;
    }
}

// make search query
function makeQuery(query) {
    if (query) {
        return query;
    }
}

function makeParams(params) {
    if (params.id) {
        return params.id;
    }
}
