import { Request, Response, Application } from "express";
import { Page } from "./models/page";
import { Logger } from "./core/logger";

export class Routes {
  public constructor(private app: Application) {
   
    /**
     * Index
     */
    this.app.get("/", (req: Request, res: Response) => {
      Logger.debug("app root");
      res.render("pages/index", new Page("Home Synker Media Server"));
    });

    /**
     * About
     */
    this.app.get("/about", function(req: Request, res: Response) {
      res.render("pages/about", new Page("About Synker Media Server"));
    });
  }
}

export default Routes;
