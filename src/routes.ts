import { Request, Response, Application } from "express";
import { Page } from "./models/page";
import { Logger } from "./core/logger";

export default class Routes {
  public constructor(private app: Application) {
   
    /**
     * Index
     */
    this.app.get("/", (req: Request, res: Response) => {
      Logger.debug("app root");
      res.render("pages/index", new Page("Home-HOLO"));
    });

    /**
     * About
     */
    this.app.get("/about", function(req: Request, res: Response) {
      res.render("pages/about", new Page("About-HOLO"));
    });

   /**
     * Playlist 
     */
    this.app.get("/playlist", function(req: Request, res: Response) {
      res.render("pages/playlist", new Page("Playlist-HOLO"));
    });
  }
}