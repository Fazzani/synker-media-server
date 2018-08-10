/// <reference path='./typings.d.ts' />
import express from "express";
import { createServer, Server } from "http";
import socketIo from "socket.io";
import path from "path";
import * as bodyParser from "body-parser";
import cors from "cors";
import { Logger, LOG_TYPES } from "./core/logger";
import FFmpegService from "./models/ffmpeg";
import { NodeMediaServer } from "node-media-server";
import JSON from "circular-json";

export default class MediaServer {
  public app: express.Application;
  private io: SocketIO.Server = <SocketIO.Server>{};
  protected server: Server = <Server>{};
  public ffmpegService: FFmpegService = <FFmpegService>{};

  /* public modifiers are default ones and could be omitted. I prefer to always set them, so code  style is more consistent. */
  public port: number;
  nms: NodeMediaServer;
  nms_port: number;

  constructor(port: number = 8084) {
    this.app = express();
    this.nms_port = 8000;
    this.port = port;
    this.app.set("port", port);
    this.app.set("nms_port", this.nms_port);
    this.config();
    this.configNodeMediaServer();
    this.createServer();
    this.sockets();
    this.listen();
    this.nms.run();
    this.nms.on("postConnect", (id, args) => {
      this.io.send("NMS_EVENT", { event: "postConnect", id, args });
      Logger.log("[NodeEvent on postConnect]", `id=${id} args=${JSON.stringify(args)}`);
    });

    this.nms.on("doneConnect", (id, args) => {
      this.io.send("NMS_EVENT", { event: "doneConnect", id, args });
      Logger.log("[NodeEvent on doneConnect]", `id=${id} args=${JSON.stringify(args)}`);
    });

    this.nms.on("prePublish", (id, StreamPath, args) => {
      this.io.send("NMS_EVENT", { event: "prePublish", id, args });
      Logger.log("[NodeEvent on prePublish]", `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
      let session = this.nms.getSession(id);
      Logger.log(`[NodeEvent on prePlay] session : ${JSON.stringify(session)}`);
      // session.reject();
    });

    this.nms.on("postPublish", (id, StreamPath, args) => {
      this.io.send("NMS_EVENT", { event: "postPublish", id, args });
      Logger.log("[NodeEvent on postPublish]", `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    this.nms.on("donePublish", (id, StreamPath, args) => {
      this.io.send("NMS_EVENT", { event: "donePublish", id, args });
      Logger.log("[NodeEvent on donePublish]", `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    this.nms.on("prePlay", (id, StreamPath, args) => {
      this.io.send("NMS_EVENT", { event: "prePlay", id, args });
      Logger.log("[NodeEvent on prePlay]", `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
      let session = this.nms.getSession(id);
      Logger.log(`[NodeEvent on prePlay] session : ${JSON.stringify(session)}`);
      // session.reject();
    });

    this.nms.on("postPlay", (id, StreamPath, args) => {
      this.io.send("NMS_EVENT", { event: "postPlay", id, args });
      Logger.log("[NodeEvent on postPlay]", `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });

    this.nms.on("donePlay", (id, StreamPath, args) => {
      this.io.send("NMS_EVENT", { event: "donePlay", id, args });
      Logger.log("[NodeEvent on donePlay]", `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    });
  }

  private config() {
    this.app.set("view engine", "ejs");

    this.app.use(cors());
    
    this.app.use(express.static(path.join(__dirname, "../public")));
    //this.app.use(express.static(path.join(__dirname, "../views")));
    // this.app.use(express.static(path.join(__dirname,'../node_modules/bootstrap/dist/')));
    this.app.use(express.static(path.join(__dirname, "../node_modules/flv.js/dist/")));
    this.app.use('/libraries', express.static('node_modules'));
    this.app.use(express.static(path.join(__dirname, "/")));
    // this.app.use("/favicon.ico", express.static(path.join(__dirname, "../public/images/favicon.ico")));
    // set bodyParser middleware to get form data
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // HTTP requests logger
    if (!process.env.NODE_ENV || (<string>process.env.NODE_ENV).trim() === "production") {
      console.log("EN MODE PRODUCTION");
      Logger.setLogType(LOG_TYPES.FFDEBUG);
    }
  }

  configNodeMediaServer(): any {
    const config = require("../nms.config.json");
    this.nms = new NodeMediaServer(config);
  }

  private createServer(): void {
    this.server = createServer(this.app);
  }

  private sockets(): void {
    this.io = socketIo(this.server);
    const config = require("../nms.config.json");
    Logger.debug(config);
    this.ffmpegService = new FFmpegService(this.io, `rtmp://localhost:${config.rtmp.port}`, `http://localhost:${config.http.port}`);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.on("connect", (socket: any) => {
      console.log("Connected client on port %s.", this.port);
      // socket.on('message', (m: Message) => {
      //     console.log('[server](message): %s', JSON.stringify(m));
      //     this.io.emit('message', m);
      // });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }

  public getFFmpegService(): FFmpegService {
    return this.ffmpegService;
  }

  public getServer(): Server {
    return this.server;
  }

  public getSockerIoServer(): SocketIO.Server {
    return this.io;
  }
}
