const {
  NodeMediaServer
} = require('node-media-server')
const Logger = require('./server/core/logger')
let Page = require('./server/models/page')
let FFmpegService = require('./server/models/ffmpeg')
var express = require('express');
var readline = require('readline');
var path = require('path');
const bodyParser = require("body-parser");
const {
  spawn
} = require('child_process');

const port = process.env.PORT || 8000
const port_rtmp = process.env.PORT_RTMP || 1935
let SERVER_MEDIA_PORT = process.env.PORT_API || 8084;

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(__dirname))
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
Logger.setLogType(Logger.LOG_TYPES.FFDEBUG);

let ffmpegService = new FFmpegService('rtmp://servermedia.synker.ovh:1935');
/**
 * stream infos
 */
app.post("/stream/info", (req, res) => {
  //Logger.log(req.body.stream.url);
  console.log('body: ' + req.body);
  let result = ffmpegService.InfoCommand("\"" + req.body.stream.url + "\"");
  const child = spawn(result.command, {
    encoding: 'utf8',
    // stdio: 'inherit',
    shell: true
  });

  readline.createInterface({
    input: child.stdout,
    terminal: false
  }).on('line', function (line) {
    //console.log('line---------: ', line)
    io.sockets.emit("shellResultEvent", line.toString());
  });

  child.on('exit', (code, signal) => {
    console.log('child process exited with ' + `code ------------${code} and signal ${signal}`);
  });
  res.send(result);
});
/**
 * play stream
 */
app.post("/stream/live", (req, res) => {
  Logger.log(req.body.stream.url);
  let result = ffmpegService.LiveCommand("\"" + req.body.stream.url + "\"");
  const child = spawn(result.command, {
    encoding: 'utf8',
    // stdio: 'inherit',
    shell: true
  });

  readline.createInterface({
    input: child.stdout,
    terminal: false
  }).on('line', function (line) {
    //console.log('line---------: ', line)
    io.sockets.emit("shellResultEvent", line.toString());
  });

  child.on('exit', (code, signal) => {
    console.log('child process exited with ' + `code ------------${code} and signal ${signal}`);
  });
  res.send(result);
});

/**
 * Execute shell command
 */
app.post("/shell", (req, res) => {
  Logger.log(req.body.shell.command);
  if (req.body.shell.command == undefined || req.body.shell.command === '') {
    return "KO";
  }
  const child = spawn(req.body.shell.command, {
    encoding: 'utf8',
    // stdio: 'inherit',
    shell: true
  });

  readline.createInterface({
    input: child.stdout,
    terminal: false
  }).on('line', function (line) {
    //console.log('line---------: ', line)
    io.sockets.emit("shellResultEvent", line.toString());
  });

  child.on('exit', (code, signal) => {
    console.log('child process exited with ' + `code ------------${code} and signal ${signal}`);
  });
});

/**
 * Index
 */
app.get('/', (req, res) => {
  Logger.debug('app root');
  res.render('pages/index', new Page('Home Synker Media Server'));
});

/**
 * About
 */
app.get('/about', function (req, res) {
  res.render('pages/about', new Page('About Synker Media Server'));
});

const config = {
  rtmp: {
    port: port_rtmp,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: port,
    allow_origin: '*'
  }
};

var nms = new NodeMediaServer(config)

// graceful shutdown
process.on('SIGTERM', () => {
  Logger.debug('SIGTERM signal received')

  // close server first
  callbackToPromise(app.close)
    // exit process
    .then(() => {
      Logger.debug('Succesfull graceful shutdown')
      process.exit(0)
    })
    .catch((err) => {
      Logger.error('Server close')
      process.exit(-1)
    })
})

nms.run();

app.use((req, res, next) => {
  // res.setHeader('Content-Type', 'text/plain');
  // res.status(404).send('Page introuvable !');
  res.render('pages/error', {
    status: 500,
    message: 'Page introuvable !'
  });
});

server.listen(SERVER_MEDIA_PORT);
/**
 * sockets
 */
io.on('connection', function (socket) {
  socket.emit('news', {
    hello: 'world'
  });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});