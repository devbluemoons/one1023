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
    findById: (req, res, next) => {
        Family.findOne(req.params).then(result => res.send(result));
    },
    findByMemberId: (req, res, next) => {
        Family.findOne(req.params).then(result => res.send(result));
    },
    update: (req, res, next) => {
        // update data
        Family.findByIdAndUpdate(req.body._id, req.body, { new: true })
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
