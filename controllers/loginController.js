"use strict";

const passport = require("passport");

module.exports = {
    main: (req, res, next) => {
        res.render("dashboard");
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: "Failed to login.",
        successRedirect: "/dashboard",
        successFlash: "Logged in!",
    }),

    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
};
