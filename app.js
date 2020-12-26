"use strict";

// use dotenv
require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const layouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const Admin = require("./models/adminSchema");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(layouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser(process.env.SECRET_KEY));
app.use(
    session({
        secret: process.env.SECRET_KEY,
        cookie: {
            maxAge: 4000000,
        },
        resave: false,
        saveUninitialized: false,
    })
);
app.use(connectFlash());
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// image directory
app.use("/uploads", express.static("uploads"));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;

///////////////////
//               //
//  set MongoDB  //
//               //
///////////////////

const mongoose = require("mongoose");

// use native Promise of nodejs
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to mongodb"))
    .catch(e => console.error(e));
