import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";

export class ExamplesController {
  constructor(private app: Application, private socketServer: SocketIO.Server) {
    this.init();
  }

  private init(): void {
    Logger.log("init ExamplesController");
    /**
     * Get Examples
     */
    this.app.get("/examples/list", (req: Request, res: Response) => {
      Logger.log("/api/examples");
      res.send(require("../../public/videos.json"));
    });
  }
}
