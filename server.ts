require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");

import { Response, Request } from "express";
import { AuthenticationController } from "./controllers/auth";
import { MiddlewareController } from "./controllers/middleware";
import { ProfileController } from "./controllers/profile/profileController";

export const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect(function (err: Error) {
  if (err) {
    console.log("A database connection error was encountered.");
    return console.log(err);
  }

  console.log("Successfully connected to MySQL. Starting server...");

  //Create and configure express app
  const app = express();

  app.use(express.static(__dirname + "/pages"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  //Instantiate required classes
  const authenticationInstance = new AuthenticationController();
  const middlewareInstance = new MiddlewareController();
  const profileInstance = new ProfileController();

  //Define Primary Routes
  app.get("/login", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/pages/login/login.html");
  });
  app.get("/register1", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/pages/first.html");
  });
  app.get("/register2", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/pages/second.html");
  });
  app.get(
    "/secret",
    middlewareInstance.authentication,
    (req: Request, res: Response) => {
      res.send("This secret content can be viewed only after logging in.");
    }
  );
  app.use("/auth", authenticationInstance.register());
  app.use("/profile", profileInstance.register());

  //Start server
  let port = process.env.PORT || 6600;

  app.listen(port, function (err: Error) {
    if (err) return console.log(err);
    console.log(`Server is live on PORT ${port}`);
  });
});
