const CodeService = require("../service/codeService");
const Code = require("../models/codeSchema");
const Paginator = require("../middlewares/paginator");

module.exports = {
    create: (req, res, next) => {
        // save data
        Code(req.body)
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
    findByDivision: async (req, res, next) => {
        const param = req.query;
        const codeRecord = await CodeService.findByDivision(param);

        res.send(codeRecord);
    },
    findByDivisionAndId: (req, res, next) => {
        Code.findOne(req.query).then(result => res.send(result));
    },
    findByDivisionAndName: (req, res, next) => {
        Code.findOne(req.query).then(result => res.send(result));
    },
    update: (req, res, next) => {
        // update data
        Code.findByIdAndUpdate(req.body._id, req.body, { new: true })
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
    delete: (req, res, next) => {
        // update data
        Code.findByIdAndDelete({ _id: req.body._id })
            .then(result => {
                if (result) {
                    res.send(result);
                }
            })
            .catch(error => {
                console.error(error.message);
                next(error);
            });
    },
};
