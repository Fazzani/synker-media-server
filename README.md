# synker-media-server

[![Build Status](https://travis-ci.org/Fazzani/synker-media-server.svg?branch=master)](https://travis-ci.org/Fazzani/synker-media-server)

## Examples

```sh
sudo docker run -v "${pwd}:/tmp" jrottenberg/ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts \
-c:v libx264 -c:a copy -bsf:a aac_adtstoasc $ffmpeg_options  /tmp/out.mp4

sudo docker run jrottenberg/ffmpeg -re -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c copy \
-f flv rtmp://servermedia.synker.ovh:30001/live/test

sudo docker run jrottenberg/ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -stats $ffmpeg_options - > output.mp4
```