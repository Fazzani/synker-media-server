import Routes from "./routes"
import MediaServer from "./mediaServer";
let server = new MediaServer(8084);
let app = server.getApp();
let routes = new Routes(app, server.getSockerIoServer(), server.getFFmpegService());
export { app };