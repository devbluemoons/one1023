const LoginService = require("../service/loginService");

module.exports = {
    login: (req, res, next) => {
        res.render("login", { layout: false });
    },
    authenticate: (req, res, next) => {
        console.log(req.body);

        req.flash("test");
        res.locals.redirect = "/member/list";
        next();
    },
};
