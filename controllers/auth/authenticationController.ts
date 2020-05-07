const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import { Request, Response, Router } from "express";
import { client } from "../../server";

export class AuthenticationController {
  router: Router = Router();
  collection = client.db("projectCO").collection("userDetails");

  register = (): Router => {
    this.router.post("/login", this.userLogin);
    this.router.post("/register", this.userRegister);

    this.router.get("/logout", this.userLogout);

    return this.router;
  };

  userLogin = async (req: Request, res: Response) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
      let userQuery = await this.collection.findOne({ email: email });

      if (userQuery == null) {
        console.log("User was not found");
        return res.status(401).json({ error: "User not found in database" });
      }

      let compareResponse: boolean = await bcrypt.compare(
        password,
        userQuery["password"]
      );

      if (!compareResponse) {
        console.log("Invalid credentials");
        return res.status(401).json({ error: "Invalid credentials" });
      }

      let token = await jwt.sign(
        {
          expiresIn: "1h",
        },
        process.env.SECRET
      );

      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .send("User logged in and token stored as a cookie.");
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error:
          "Server faced some unexpected error. Check the log for more details.",
      });
    }
  };

  userRegister = async (req: Request, res: Response) => {
    console.log(req.body);
    let username = req.body.username;
    let email = req.body.email;
    let country = req.body.country;
    let phone = req.body.phone;
    let password = req.body.password;

    try {
      //Checking for email conflict
      let emailQuery = await this.collection.find({ email: email }).toArray();
      if (emailQuery.length != 0) {
        console.log("User email already exists");
        return res.status(409).json({ error: "User email already exists" });
      }

      //Hashing the password with 14 rounds of salting
      let hash = await bcrypt.hash(password, 14);

      //Adding new document to the collection
      let insertResponse = await this.collection.insertOne({
        username: username,
        email: email,
        country: country,
        phone: phone,
        password: hash,
      });

      res.status(200).send("User registered successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error:
          "Server faced some unexpected error. Check the log for more details.",
      });
    }
  };

  userLogout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).send("User has been logged out");
  };
}
