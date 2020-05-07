"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var cookieParser = require("cookie-parser");
var auth_1 = require("./controllers/auth");
var middleware_1 = require("./controllers/middleware");
exports.client = new MongoClient(process.env.MONGOURL, {
    useUnifiedTopology: true,
});
exports.client.connect(function (err) {
    if (err) {
        console.log("A database connection error was encountered.");
        return console.log(err);
    }
    console.log("Successfully connected to MongoDB. Starting server...");
    //Create and configure express app
    var app = express();
    app.use(express.static(__dirname + "/pages/client"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    //Instantiate required classes
    var authenticationInstance = new auth_1.AuthenticationController();
    var middlewareInstance = new middleware_1.MiddlewareController();
    //Define Primary Routes
    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/pages/client/index.html");
    });
    app.get("/login", function (req, res) {
        res.sendFile("/login/index.html");
    });
    app.get("/signup", function (req, res) {
        res.sendFile("/signup/index.html");
    });
    app.get("/secret", middlewareInstance.authentication, function (req, res) {
        res.send("This secret content can be viewed only after logging in.");
    });
    app.use("/auth", authenticationInstance.register());
    //Start server
    var port = process.env.PORT || 6600;
    app.listen(port, function (err) {
        if (err)
            return console.log(err);
        console.log("Server is live on PORT " + port);
    });
});
