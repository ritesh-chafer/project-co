"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
var express_1 = require("express");
var server_1 = require("../../server");
var AuthenticationController = /** @class */ (function () {
    function AuthenticationController() {
        var _this = this;
        this.router = express_1.Router();
        this.register = function () {
            _this.router.post("/login", _this.userLogin);
            _this.router.post("/register", _this.userRegister);
            _this.router.get("/logout", _this.userLogout);
            return _this.router;
        };
        this.userLogin = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var email, password;
            return __generator(this, function (_a) {
                email = req.body.email;
                password = req.body.password;
                server_1.connection.query;
                server_1.connection.query("SELECT * FROM `userdetails` WHERE email=? LIMIT 1", [email], function (error, results, fields) {
                    return __awaiter(this, void 0, void 0, function () {
                        var compareResponse, token, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (results.length == 0) {
                                        console.log("User was not found");
                                        return [2 /*return*/, res.status(401).json({ error: "User not found in database" })];
                                    }
                                    return [4 /*yield*/, bcrypt.compare(password, results[0].password)];
                                case 1:
                                    compareResponse = _a.sent();
                                    if (!compareResponse) {
                                        console.log("Invalid credentials");
                                        return [2 /*return*/, res.status(401).json({ error: "Invalid credentials" })];
                                    }
                                    _a.label = 2;
                                case 2:
                                    _a.trys.push([2, 4, , 5]);
                                    return [4 /*yield*/, jwt.sign({
                                            expiresIn: "1h",
                                        }, process.env.SECRET)];
                                case 3:
                                    token = _a.sent();
                                    return [3 /*break*/, 5];
                                case 4:
                                    err_1 = _a.sent();
                                    res.status(500).json({ error: "Internal Server Error" });
                                    return [3 /*break*/, 5];
                                case 5:
                                    res
                                        .cookie("token", token, { httpOnly: true })
                                        .status(200)
                                        .json({ success: "User logged in and token stored as a cookie." });
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        }); };
        this.userRegister = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, email, country, phone, password;
            return __generator(this, function (_a) {
                username = req.body.name;
                email = req.body.email;
                country = req.body.country;
                phone = req.body.phone;
                password = req.body.password;
                server_1.connection.query("SELECT * FROM `userdetails` WHERE `email`=?", [email], function (error, results, fields) {
                    return __awaiter(this, void 0, void 0, function () {
                        var hash, err_2, activeToken;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log(results);
                                    if (results.length != 0) {
                                        console.log("User email already exists");
                                        return [2 /*return*/, res.status(409).json({ error: "User email already exists" })];
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, bcrypt.hash(password, 14)];
                                case 2:
                                    //Hashing the password with 14 rounds of salting
                                    hash = _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_2 = _a.sent();
                                    return [2 /*return*/, res.status(500).json({ error: "Internal Server Error" })];
                                case 4:
                                    activeToken = Math.floor(Math.random() * 100000);
                                    //Adding new row to the table
                                    server_1.connection.query("INSERT INTO `userdetails` (name, email, country, phone, password, active) VALUES (?,?,?,?,?,?)", [username, email, country, phone, hash, activeToken], function (error, results, fields) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var transporter, info;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (error)
                                                            return [2 /*return*/, res.status(500).json({ error: "Database query issue" })];
                                                        transporter = nodemailer.createTransport({
                                                            host: "smtp.ethereal.email",
                                                            port: 587,
                                                            secure: false,
                                                            auth: {
                                                                user: process.env.SMTPUSER,
                                                                pass: process.env.SMTPPASS,
                                                            },
                                                        });
                                                        return [4 /*yield*/, transporter.sendMail({
                                                                from: '"Fred Foo 👻" <foo@example.com>',
                                                                to: email,
                                                                subject: "Project CO Confirmation Mail",
                                                                text: "Hello world?",
                                                                html: "<p>Thanks for creating an account and starting a new journey with us.</p>\n              <p\n                  style=\"background-color: blue;color: white;text-align: center;width: fit-content;padding: 30px;display: block;margin: auto;\">\n                  Welcome to Covid Opportunities<br>\n                  " + username + "<br>\n                  " + email + "<br>\n                  Please click on the link to verify your email address.\n              </p>\n              \n              <b style=\"font-family: Roboto;\">Hi " + username + " ,</b>\n              <p>In order to use SoMee, you must confirm your email. Click the button below to\n                  confirm.</p>\n                  <a href=\"http://example.com/auth/verify/" + activeToken + "\">http://example.com/auth/verify/" + activeToken + "</a>",
                                                            })];
                                                    case 1:
                                                        info = _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        }); };
        this.userLogout = function (req, res) {
            res.clearCookie("token");
            res.status(200).send("User has been logged out");
        };
    }
    return AuthenticationController;
}());
exports.AuthenticationController = AuthenticationController;
