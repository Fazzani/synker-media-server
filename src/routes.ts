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
      res.render("pages/index", { Page: new Page("Home-HOLO", ["Home"], "home") });
    });

    /**
     * About
     */
    this.app.get("/about", function(req: Request, res: Response) {
      res.render("pages/about", { Page: new Page("About-HOLO", ["Home", "About"], "about") });
    });

    /**
     * Playlist
     */
    this.app.get("/playlist", function(req: Request, res: Response) {
      res.render("pages/playlist", { Page: new Page("Playlist-HOLO", ["Home", "Playlist"], "playlist") });
    });

    /**
     * Command line
     */
    this.app.get("/commandline", function(req: Request, res: Response) {
      res.render("pages/cli", { Page: new Page("Shell-HOLO", ["Home", "Command Line"], "commandline") });
    });

    /**
     * Login
     */
    this.app.get("/login", function(req: Request, res: Response) {
      res.render("pages/login", { Page: new Page("Login-HOLO", ["Home", "Login"], "/login") });
    });

    /**
     * Register
     */
    this.app.get("/register", function(req: Request, res: Response) {
      res.render("pages/register", { Page: new Page("Register-HOLO", ["Home", "Register"], "register") });
    });

    /**
     * Stats
     */
    this.app.get("/stats", function(req: Request, res: Response) {
      res.render("pages/stats", { Page: new Page("Stats-HOLO", ["Home", "Statistics"], "stats") });
    });
  }
}
