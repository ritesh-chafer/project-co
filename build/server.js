"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mysql = require("mysql");
var auth_1 = require("./controllers/auth");
var middleware_1 = require("./controllers/middleware");
var profileController_1 = require("./controllers/profile/profileController");
exports.connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});
exports.connection.connect(function (err) {
    if (err) {
        console.log("A database connection error was encountered.");
        return console.log(err);
    }
    console.log("Successfully connected to MySQL. Starting server...");
    //Create and configure express app
    var app = express();
    app.use(express.static(__dirname + "/pages"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    //Instantiate required classes
    var authenticationInstance = new auth_1.AuthenticationController();
    var middlewareInstance = new middleware_1.MiddlewareController();
    var profileInstance = new profileController_1.ProfileController();
    //Define Primary Routes
    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/pages/files/index.html");
    });
    app.get("/login", function (req, res) {
        res.sendFile(__dirname + "/pages/login/login.html");
    });
    app.get("/loginerr", function (req, res) {
        res.sendFile(__dirname + "/pages/login/loginerr.html");
    });
    app.get("/signup", function (req, res) {
        res.sendFile(__dirname + "/pages/signup/signup.html");
    });
    app.get("/signuperr", function (req, res) {
        res.sendFile(__dirname + "/pages/signup/signuperr.html");
    });
    app.get("/signupres", function (req, res) {
        res.sendFile(__dirname + "/pages/response.html");
    });
    app.get("/register1", function (req, res) {
        res.sendFile(__dirname + "/pages/first.html");
    });
    app.get("/register2", function (req, res) {
        res.sendFile(__dirname + "/pages/second.html");
    });
    app.get("/secret", middlewareInstance.authentication, function (req, res) {
        res.send("This secret content can be viewed only after logging in.");
    });
    app.use("/auth", authenticationInstance.register());
    app.use("/profile", profileInstance.register());
    //Start server
    var port = process.env.PORT || 6600;
    app.listen(port, function (err) {
        if (err)
            return console.log(err);
        console.log("Server is live on PORT " + port);
    });
});
