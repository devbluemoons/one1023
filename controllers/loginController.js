const LoginService = require("../service/loginService");

module.exports = {
    login: (req, res, next) => {
        // res.render("index");
    },
    authenticate: (req, res, next) => {
        res.render("index");
    },
};
