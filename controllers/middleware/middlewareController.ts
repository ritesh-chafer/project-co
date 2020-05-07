const jwt = require("jsonwebtoken");

import { Request, Response, NextFunction } from "express";

export class MiddlewareController {
  authentication = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.token;
    try {
      let payload = await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      console.log("Invalid token");
      return res.status(401).json({ error: "Invalid token" });
    }
    return next();
  };
}
