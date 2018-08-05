import Routes from "./routes";
import MediaServer from "./mediaServer";
import { ExamplesController } from "./controllers/examplesController";
import { ShellController } from "./controllers/shellController";
import { FfmpegController } from "./controllers/ffmpegController";
import { NmsController } from "./controllers/nmsController";
import MetadataArgsStorage from "./core/metadataArgsStorage";

let server = new MediaServer(8084);
let app = server.getApp();

new Routes(app);
new ExamplesController(app, server.getSockerIoServer());
new NmsController(app, server.getSockerIoServer());
new FfmpegController(app, server.getSockerIoServer(), server.getFFmpegService());
new ShellController(app, server.getSockerIoServer());

//Auto call to init method for each controller
MetadataArgsStorage.Default.controllers.forEach(c => {
  if (c.target) {
    c.target.init(c);
  }
});
//  /**
//      * Errors handler
//      */
//     app.use((req: Request, res: Response, next) => {
//         // res.setHeader('Content-Type', 'text/plain');
//         res.status(404).send("Page introuvable !");
//         // res.render("pages/error", {
//         //   status: 500,
//         //   message: "Page introuvable !",
//         //   title: "Oops"
//         // });
//       });
export { app };
