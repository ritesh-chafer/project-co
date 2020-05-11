import { Request, Response, Router } from "express";
import { connection } from "../../server";

export class ProfileController {
  router: Router = Router();

  register = (): Router => {
    this.router.post("/second", this.processSecond);
    return this.router;
  };

  processSecond = (req: Request, res: Response) => {
    console.log(req.body);
    res.sendStatus(200);
  };
}
