import { Application, Request, Response } from "express";
import { Logger } from "../core/logger";
import Controller from "../core/controller";
import { ApiController } from "../core/decorators";
import JSON from "circular-json";
import { Playlist } from "../models/playlist";

@ApiController
export class PlaylistController extends Controller{
  constructor(private app: Application, private socketServer: SocketIO.Server) {
    super();
    Logger.log((<any>this).constructor.name);
  }

  private init(): void {
    Logger.log(`init PlaylistController ${this.baseUrl}`);

   /**
     * List
     */
    this.app.get(`${this.baseUrl}`, (req: Request, res: Response) => {
        const playlist = [new Playlist("test", "http://example.url/playlist/1"), new Playlist("test pl", "http://example.url/playlist/2")];
        res.send(JSON.stringify(playlist));
      });

      /**
     * Get Playlist
     */
    this.app.get(`${this.baseUrl}/:id`, (req: Request, res: Response) => {
        const playlist = new Playlist("test",`http://example.url/playlist/${req.params.id}`);
        res.send(JSON.stringify(playlist));
      });
  }
}
