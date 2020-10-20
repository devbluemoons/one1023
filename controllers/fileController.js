// file Shema
const File = require("../models/fileSchema");

module.exports = {
    upload: (req, res, next) => {
        console.log(req.file); // 콘솔(터미널)을 통해서 "req.file" 내용 확인 가능.
        res.send(req.file); // object를 리턴함
    },
    find: (req, res, next) => {
        File.findById({ id: req.body.id })
            .exec()
            .then(result => {
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

function makeFormData(data) {
    if (data) {
        return new File({
            name: data.name,
            size: data.size,
            uploader: data.uploader,
        });
    }
    return new Error("data is empty!");
}
