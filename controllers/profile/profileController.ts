import { Request, Response, Router } from "express";
import { connection } from "../../server";
import { monitorEventLoopDelay } from "perf_hooks";
import { link } from "fs";

export class ProfileController {
  router: Router = Router();

  register = (): Router => {
    this.router.post("/first", this.processFirst);
    this.router.post("/second", this.processSecond);
    return this.router;
  };

  processFirst = (req: Request, res: Response) => {
    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let city = req.body.city;
    let country = req.body.country;
    let college = req.body.college;
    let degree = req.body.degree;
    let major = req.body.major;
    let sDate = req.body.sdate;
    let eDate = req.body.edate;

    connection.query(
      "INSERT INTO `userprofile` (fname, lname, email, mobile, city, country, college, degree, major, sdate, edate, options, linkedin, github) VALUES (?,?,?,?,?,?,?,?,?,?,?, NULL, NULL, NULL)",
      [
        firstName,
        lastName,
        email,
        mobile,
        city,
        country,
        college,
        degree,
        major,
        sDate,
        eDate,
      ],
      function (error: Error, results: any, fields: any) {
        if (error) {
          console.log(error);
          alert(
            "There was some error while processing your data. Please retry."
          );
          res.redirect("/register1");
        }
        res.redirect("/register2?email=" + email);
      }
    );
  };

  processSecond = (req: Request, res: Response) => {
    let ops = "";
    if (Array.isArray(req.body.options)) {
      req.body.options.forEach((element: string) => {
        ops = element + ", " + ops;
      });
    } else {
      ops = req.body.options;
    }
    let linkedin = req.body.linkedin;
    let github = req.body.github;
    let email = req.body.emailValue;
    connection.query(
      "UPDATE `userprofile` SET options=?, linkedin=?, github=? WHERE email=?",
      [ops, linkedin, github, email],
      (error: Error, results: any, fields: any) => {
        if (error) {
          console.log(error);
          alert("You data could not be saved. Please try again");
          return res.redirect("/register2?email=" + email);
        }
        res.redirect("/finish");
      }
    );
  };
}
