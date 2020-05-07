require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cookieParser = require("cookie-parser");

import { Response, Request } from "express";
import { AuthenticationController } from "./controllers/auth";
import { MiddlewareController } from "./controllers/middleware";

export const client = new MongoClient(process.env.MONGOURL, {
  useUnifiedTopology: true,
});

client.connect(function (err: Error) {
  if (err) {
    console.log("A database connection error was encountered.");
    return console.log(err);
  }
  console.log("Successfully connected to MongoDB. Starting server...");

  //Create and configure express app
  const app = express();

  app.use(express.static(__dirname + "/pages/client"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  //Instantiate required classes
  const authenticationInstance = new AuthenticationController();
  const middlewareInstance = new MiddlewareController();

  //Define Primary Routes
  app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/pages/client/index.html");
  });
  app.get("/login", (req: Request, res: Response) => {
    res.sendFile("/login/index.html");
  });
  app.get("/signup", (req: Request, res: Response) => {
    res.sendFile("/signup/index.html");
  });
  app.get(
    "/secret",
    middlewareInstance.authentication,
    (req: Request, res: Response) => {
      res.send("This secret content can be viewed only after logging in.");
    }
  );
  app.use("/auth", authenticationInstance.register());

  //Start server
  let port = process.env.PORT || 6600;

  app.listen(port, function (err: Error) {
    if (err) return console.log(err);
    console.log(`Server is live on PORT ${port}`);
  });
});
