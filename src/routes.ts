import { Application } from "express";
import { Request, Response } from "express";
import * as http from "http";
import * as child from "child_process";
import { Page } from "./models/page";
import readline = require("readline");
import { Logger } from "./core/logger";
import FFmpegService from "./models/ffmpeg";

export class Routes {
  public constructor(private app: Application, private socketServer: SocketIO.Server, private ffmpegService: FFmpegService) {
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
    app.get("/api/server", (req: Request, res: Response) => {
      Logger.debug("/api/server");
      http.get(`http://localhost:${app.get("nms_port")}/api/server`, resp => {
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
     * stream infos
     */
    app.post("/stream/info", (req: Request, res: Response) => {
      //Logger.log(req.body.stream.url);
      console.log("body: " + req.body);
      let result = this.ffmpegService.InfoCommand(req.body.stream.url);
      const childSpawn = child.spawn(result.command, [], <child.SpawnOptions>{
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
      });
      res.send(res.json(result));
    });

    /**
     * play stream
     */
    app.post("/stream/live", (req: Request, res: Response) => {
      //TODO: Déduplication des demandes

      Logger.log(req.body.stream.url);
      Logger.log(req.body.stream.streamId);
      let audio_codec = req.body.stream.audio_codec === undefined ? "copy" : req.body.stream.audio_codec;
      let video_size = req.body.stream.video_size === undefined ? "640x480" : req.body.stream.video_size;
      let format = req.body.stream.format === undefined ? "flv" : req.body.stream.format;
      let audio_bitrate = req.body.stream.audio_bitrate === undefined ? "56k" : req.body.stream.audio_bitrate;
      let video_bitrate = req.body.stream.video_bitrate === undefined ? "400k" : req.body.stream.video_bitrate;
      let audio_resolution = req.body.stream.audio_resolution === undefined ? "22050" : req.body.stream.audio_resolution;

      let command = this.ffmpegService.LiveCommand(
        req.body.stream.streamId,
        req.body.stream.url,
        audio_codec,
        "libx264",
        video_size,
        format,
        audio_bitrate,
        video_bitrate,
        audio_resolution
      );

      res.send(res.json(command));
    });

    /**
     * stop stream by streamId
     */
    app.get("/stream/stop/:streamId", (req: Request, res: Response) => {
      Logger.log(`Request to stop stream : ${req.params.streamId}`);
      this.ffmpegService.StopCommand(req.params.streamId);
      res.send(
        res.json({
          streamId: req.params.streamId,
          status: "stopped"
        })
      );
    });

    /**
     * Execute shell command
     */
    app.post("/shell", (req: Request, res: Response) => {
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

    /**
     * Index
     */
    app.get("/", (req: Request, res: Response) => {
      Logger.debug("app root");
      res.render("pages/index", new Page("Home Synker Media Server"));
    });

    /**
     * About
     */
    app.get("/about", function(req: Request, res: Response) {
      res.render("pages/about", new Page("About Synker Media Server"));
    });

    /**
     * Errors handler
     */
    app.use((req: Request, res: Response, next) => {
      // res.setHeader('Content-Type', 'text/plain');
      res.status(404).send("Page introuvable !");
      // res.render("pages/error", {
      //   status: 500,
      //   message: "Page introuvable !",
      //   title: "Oops"
      // });
    });
  }
}

export default Routes;
