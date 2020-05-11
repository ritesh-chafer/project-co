const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

import { Request, Response, Router } from "express";
import { connection } from "../../server";

export class AuthenticationController {
  router: Router = Router();

  register = (): Router => {
    this.router.post("/login", this.userLogin);
    this.router.post("/register", this.userRegister);

    this.router.get("/logout", this.userLogout);

    return this.router;
  };

  userLogin = async (req: Request, res: Response) => {
    let email = req.body.email;
    let password = req.body.password;

    connection.query;
    connection.query(
      "SELECT * FROM `userdetails` WHERE email=? LIMIT 1",
      [email],
      async function (error: Error, results: any, fields: any) {
        if (error) return res.redirect("/loginerr");

        if (results.length == 0) {
          console.log("User was not found");
          return res.redirect("/loginerr");
        }

        let compareResponse: boolean = await bcrypt.compare(
          password,
          results[0].password
        );

        if (!compareResponse) {
          console.log("Invalid credentials");
          return res.redirect("/loginerr");
        }

        let token;
        try {
          token = await jwt.sign(
            {
              expiresIn: "1h",
            },
            process.env.SECRET
          );
        } catch (err) {
          return res.redirect("/loginerr");
        }

        res.cookie("token", token, { httpOnly: true }).redirect("/register1");
      }
    );
  };

  userRegister = async (req: Request, res: Response) => {
    let username = req.body.name;
    let email = req.body.email;
    let country = req.body.country;
    let phone = req.body.phone;
    let password = req.body.password;

    console.log(req.body);

    connection.query(
      "SELECT * FROM `userdetails` WHERE `email`=?",
      [email],
      async function (error: Error, results: any, fields: any) {
        if (error) return res.redirect("/signuperr");

        console.log(results);

        if (results.length != 0) {
          console.log("User email already exists");
          return res.redirect("/signuperr");
        }

        let hash;
        try {
          //Hashing the password with 14 rounds of salting
          hash = await bcrypt.hash(password, 14);
        } catch (err) {
          return res.redirect("/signuperr");
        }

        let activeToken = Math.floor(Math.random() * 100000);
        //Adding new row to the table
        connection.query(
          "INSERT INTO `userdetails` (name, email, country, phone, password, active) VALUES (?,?,?,?,?,?)",
          [username, email, country, phone, hash, activeToken],
          async function (error: Error, results: any, fields: any) {
            if (error) return res.redirect("/signuperr");

            let transporter = nodemailer.createTransport({
              host: "smtp.ethereal.email",
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: process.env.SMTPUSER, // generated ethereal user
                pass: process.env.SMTPPASS, // generated ethereal password
              },
            });

            let info = await transporter.sendMail({
              from: '"Fred Foo 👻" <foo@example.com>', // sender address
              to: email, // list of receivers
              subject: "Project CO Confirmation Mail", // Subject line
              text: "Hello world?", // plain text body
              html: `<p>Thanks for creating an account and starting a new journey with us.</p>
              <p
                  style="background-color: blue;color: white;text-align: center;width: fit-content;padding: 30px;display: block;margin: auto;">
                  Welcome to Covid Opportunities<br>
                  ${username}<br>
                  ${email}<br>
                  Please click on the link to verify your email address.
              </p>
              
              <b style="font-family: Roboto;">Hi ${username} ,</b>
              <p>In order to use SoMee, you must confirm your email. Click the button below to
                  confirm.</p>
                  <a href="http://example.com/auth/verify/${activeToken}">http://example.com/auth/verify/${activeToken}</a>`, // html body
            });
          }
        );
      }
    );
  };

  userLogout = (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).send("User has been logged out");
  };
}
