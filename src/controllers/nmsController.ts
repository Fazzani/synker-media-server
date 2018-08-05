import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import * as http from "http";
import Controller from "../core/controller";
import { ApiController } from "../core/decorators";
import JSON from "circular-json";

@ApiController
export class NmsController extends Controller{
  constructor(private app: Application, private socketServer: SocketIO.Server) {
      super();
  }

  private init(): void {
    Logger.log("init NmsController");

    /**
     * Redirection to api streams
     */
    this.app.get(`${this.baseUrl}/streams`, (req: Request, res: Response) => {
      Logger.debug("/api/streams");
      http.get(`http://localhost:${this.app.get("nms_port")}/api/streams`, resp => {
        let data = "";
        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => {
          res.send(data);
        });
      });
    });

    /**
     * Redirection to api server
     */
    this.app.get(`${this.baseUrl}/server`, (req: Request, res: Response) => {
      Logger.debug("/api/server");
      http.get(`http://localhost:${this.app.get("nms_port")}/api/server`, resp => {
        let data = "";
        // A chunk of data has been recieved.
        resp.on("data", chunk => {
          data += chunk;
        });
        resp.on("end", () => {
          res.send(data);
        });
      });
    });
  }
}
