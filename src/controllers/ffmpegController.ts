import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import FFmpegService from "../models/ffmpeg";
import readline = require("readline");
import * as child from "child_process";
import Controller from "../core/controller";
import { ApiController } from "../core/decorators";
import JSON from "circular-json";

@ApiController
export class FfmpegController extends Controller{
  constructor(private app: Application, private socketServer: SocketIO.Server, private ffmpegService: FFmpegService) {
    super();
    Logger.log((<any>this).constructor.name);
  }

  private init(): void {
    Logger.log("init FfmpegController");

    /**
     * stream infos
     */
    this.app.post(`${this.baseUrl}/info`, (req: Request, res: Response) => {
      Logger.log(req.body.stream.url);
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
      res.send(JSON.stringify(result));
    });

    /**
     * play stream
     */
    this.app.post(`${this.baseUrl}/live`, (req: Request, res: Response) => {
      //TODO: Déduplication des demandes with the same streamId

      Logger.log(req.body.stream.url);
      Logger.log(req.body.stream.streamId);

      let command = this.ffmpegService.LiveCommand(
        req.body.stream.streamId,
        req.body.stream.url,
        req.body.stream.audio_codec || "copy",
        req.body.stream.video_codec || "libx264",
        req.body.stream.video_size || "640x480",
        req.body.stream.format || "flv",
        req.body.stream.audio_bitrate || "56k",
        req.body.stream.video_bitrate || "400k",
        req.body.stream.audio_resolution || "22050"
      );

      res.send(JSON.stringify(command));
    });

    /**
     * stop stream by streamId
     */
    this.app.get(`${this.baseUrl}/stop/:streamId`, (req: Request, res: Response) => {
      Logger.log(`Request to stop stream : ${req.params.streamId}`);
      this.ffmpegService.StopCommand(req.params.streamId);
      res.send(
        JSON.stringify({
          streamId: req.params.streamId,
          status: "stopped"
        })
      );
    });
  }
}
