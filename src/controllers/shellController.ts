import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import readline = require("readline");
import * as child from "child_process";
import { ApiController } from "../core/decorators";
import Controller from "../core/controller";
import JSON from "circular-json";

@ApiController
export class ShellController extends Controller {
  constructor(private app: Application, private socketServer: SocketIO.Server) {
    super();
    Logger.log((<any>this).constructor.name);
  }

  public init = () => {
    Logger.log(`init ShellController baseURL => ${this.baseUrl}`);
    /**
     * Execute shell command
     */
    this.app.post(`${this.baseUrl}/run`, (req: Request, res: Response) => {
      Logger.log(req.body.shell.command);
      if (req.body.shell.command == undefined || req.body.shell.command === "") {
        return res.status(500).send("KO");
      }
      const childSpawn = child.spawn(req.body.shell.command, [], <child.SpawnOptions>{
        encoding: "utf8",
        // stdio: 'inherit',
        shell: true
      });

      readline
        .createInterface({
          input: childSpawn.stdout,
          terminal: false
        })
        .on("line", line => {
          //console.log('line---------: ', line)
          this.socketServer.sockets.emit("shellResultEvent", line.toString());
        });

      childSpawn.on("exit", (code, signal) => {
        console.log("child process exited with " + `code ------------${code} and signal ${signal}`);
        res.status(200).end();
      });
    });
  };
}
