"use strict";

const LoginService = require("../service/loginService");

module.exports = {
    login: (req, res, next) => {
        res.render("login", { layout: false });
    },
    authenticate: (req, res, next) => {
        res.locals.redirect = "/member/list";
        next();
    },
    redirectView: (req, res, next) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
};
