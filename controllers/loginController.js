"use strict";

require("dotenv").config();
const passport = require("passport");
const Admin = require("../models/adminSchema");

module.exports = {
    main: (req, res, next) => {
        res.render("dashboard");
    },

    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },

    isAuthenticated: (req, res, next) => {
        // valid login status
        if (Object.entries(req.body).length) {
            validLogin(req, res, next);
        } else if (req.isAuthenticated()) {
            next();
        } else {
            res.status(301).redirect("/login");
        }
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!",
    }),

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
};

async function validLogin(req, res, next) {
    // check match id & email
    // if (req.body.contact === process.env.ROLE_ENG && req.body.password === process.env.ENG_PASSWORD) {
    //     // check existing engineer account
    //     const account = await Admin.findOne({ contact: req.body.contact });
    //     // case: an account exists
    //     if (account) {
    //         next();
    //     } else {
    //         // create new engineer account
    //         const engineer = new Admin({
    //             name: "Engineer",
    //             contact: process.env.ROLE_ENG,
    //             question: "Jesus' birthday?",
    //             answer: "christmas",
    //             level: "01",
    //         });

    //         Admin.register(engineer, req.body.password, (e, admin) => {
    //             if (admin) {
    //                 req.flash("success", `${admin.fullName}'s account created successfully!`);
    //                 res.locals.redirect = "/dashboard";
    //                 next();
    //             } else {
    //                 req.flash("error", `Failed to create user account because: ${e.message}.`);
    //                 res.locals.redirect = "/";
    //                 next();
    //             }
    //         });
    //     }
    // }

    if (req.body.contact && req.body.password) {
        next();
    } else {
        // login failure flash message
        req.flash("failed", "You must Login");
        res.status(301).redirect("/login");
    }
}
