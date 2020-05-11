"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ProfileController = /** @class */ (function () {
    function ProfileController() {
        var _this = this;
        this.router = express_1.Router();
        this.register = function () {
            _this.router.post("/second", _this.processSecond);
            return _this.router;
        };
        this.processFirst = function (req, res) {
            var firstName = req.body.fname;
            var lastName = req.body.lname;
            var email = req.body.email;
            var mobile = req.body.mobile;
            var city = req.body.city;
            var country = req.body.country;
        };
        this.processSecond = function (req, res) {
            console.log(req.body);
            res.sendStatus(200);
        };
    }
    return ProfileController;
}());
exports.ProfileController = ProfileController;
