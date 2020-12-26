"use strict";

const passport = require("passport");

module.exports = {
    login: (req, res, next) => {
        res.render("login", { layout: false });
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: "Failed to login.",
        successRedirect: "/dashboard",
        successFlash: "Logged in!",
    }),

    isAuthenticated: (req, res, next) => {
        console.log("@@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@ @@@");
        if (req.isAuthenticated()) {
            res.locals.redirect = "/dashboard";
            next();
        } else {
            res.status(301).redirect("/login");
        }
    },

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
