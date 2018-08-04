import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import readline = require("readline");
import * as child from "child_process";

export class ShellController {
  constructor(private app: Application, private socketServer: SocketIO.Server) {
    this.init();
  }

  private init(): void {
    Logger.log("init ShellController");
    
      /**
     * Execute shell command
     */
    this.app.post("/shell", (req: Request, res: Response) => {
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

  }
}
