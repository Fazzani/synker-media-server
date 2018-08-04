import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import * as http from "http";

export class NmsController {
  constructor(private app: Application, private socketServer: SocketIO.Server) {
    this.init();
  }

  private init(): void {
    Logger.log("init NmsController");

    /**
     * Redirection to api streams
     */
    this.app.get("/api/streams", (req: Request, res: Response) => {
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
    this.app.get("/api/server", (req: Request, res: Response) => {
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
