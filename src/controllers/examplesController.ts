import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import { ApiController } from "../core/decorators";
import Controller from "../core/controller";
import JSON from "circular-json";

@ApiController
export class ExamplesController extends Controller {
  constructor(private app: Application, private socketServer: SocketIO.Server) {
    super();
   // this.init();
  }

  public init(): void {
    Logger.log(`init ExamplesController baseURL => ${this.baseUrl}`);
    /**
     * Get Examples
     */
    this.app.get(`${this.baseUrl}/list`, (req: Request, res: Response) => {
      Logger.log("/api/examples");
      res.send(require("../../public/videos.json"));
    });
  }
}
