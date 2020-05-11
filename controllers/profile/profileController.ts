import { Request, Response, Router } from "express";
import { connection } from "../../server";

export class ProfileController {
  router: Router = Router();

  register = (): Router => {
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
      "INSERT INTO `userprofile` (fname, lname, email, mobile, city, country, college, degree, major, sdate, edate) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
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
    console.log(req.body);
    res.sendStatus(200);
  };
}
