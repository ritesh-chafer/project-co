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
  };

  processSecond = (req: Request, res: Response) => {
    console.log(req.body);
    res.sendStatus(200);
  };
}
