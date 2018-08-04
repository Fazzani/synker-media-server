import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import FFmpegService from "../models/ffmpeg";
import readline = require("readline");
import * as child from "child_process";

export class FfmpegController {
  constructor(private app: Application, private socketServer: SocketIO.Server, private ffmpegService: FFmpegService) {
    this.init();
  }

  private init(): void {
    Logger.log("init FfmpegController");
    
    /**
     * stream infos
     */
    this.app.post("/stream/info", (req: Request, res: Response) => {
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
      this.app.post("/stream/live", (req: Request, res: Response) => {
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
      this.app.get("/stream/stop/:streamId", (req: Request, res: Response) => {
        Logger.log(`Request to stop stream : ${req.params.streamId}`);
        this.ffmpegService.StopCommand(req.params.streamId);
        res.send(
          res.json({
            streamId: req.params.streamId,
            status: "stopped"
          })
        );
      });

  }
}
