const { NodeMediaServer } = require('node-media-server');
const logger = require('winston')
const port = process.env.PORT || 8000
const port_rtmp = process.env.PORT_RTMP || 1935

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
  logger.info('SIGTERM signal received')

  // close server first
  callbackToPromise(app.close)
    // exit process
    .then(() => {
      logger.info('Succesfull graceful shutdown')
      process.exit(0)
    })
    .catch((err) => {
      logger.error('Server close')
      process.exit(-1)
    })
})


nms.run();