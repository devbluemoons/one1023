// file Shema
const File = require("../models/fileSchema");

module.exports = {
    upload: (req, res, next) => {
        res.send(req.file); // object를 리턴함
    },
    find: (req, res, next) => {
        File.findById({ id: req.body.id }).then(result => {
            res.send(result);
        });
    },
    replace: (req, res, next) => {
        console.log(req);
        console.log("edit success~");
    },
    delete: (req, res, next) => {
        console.log(req);
        console.log("delete success~");
    },
};
