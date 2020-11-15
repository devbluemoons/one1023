const Family = require("../models/familySchema");

module.exports = {
    create: (req, res, next) => {
        // save data
        Family(req.body)
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
    findByMemberId: (req, res, next) => {
        Family.find(req.params)
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
    if (data && data.memberId) {
        return data.memberId;
    }
}

// make search query
function makeQuery(query) {
    if (query) {
        return query;
    }
}

// make search param
function makeParams(params) {
    if (params.memberId) {
        return { memberId: params.memberId };
    }
}
