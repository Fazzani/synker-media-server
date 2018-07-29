# synker-media-server

[![Build Status](https://travis-ci.org/Fazzani/synker-media-server.svg?branch=master)](https://travis-ci.org/Fazzani/synker-media-server)

> Based on this [docker image][docker_image] and this [image][image_ffmpeg] for testing with ffmpeg

## Examples

```sh
sudo docker run -v "${pwd}:/tmp" jrottenberg/ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts \
-c:v libx264 -c:a copy -bsf:a aac_adtstoasc $ffmpeg_options  /tmp/out.mp4

sudo docker run jrottenberg/ffmpeg -re -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c copy \
-f flv rtmp://servermedia.synker.ovh:30001/live/test

sudo docker run jrottenberg/ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -stats $ffmpeg_options - > output.mp4

# working example
sudo docker run -v=`pwd`:/tmp/ffmpeg opencoconut/ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c:v libx264 -c:a copy -bsf:a aac_adtstoasc \
-loglevel debug -f flv  "rtmp://servermedia.synker.ovh:1935/live/test live=1"

ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c:v copy -c:a copy \
-loglevel debug -f flv  "rtmp://servermedia.synker.ovh:1935/live/test live=1"

ffmpeg -re -i https://heni.freeboxos.fr:22182/share/UOpN2G-tQoNH4ito/Films/No.Good.Deed.2014.FRENCH.720p.BluRay.x264-DesTroY/destroy-nogooddeed.mkv\
 -c:v libx264 -c:a copy -bsf:a aac_adtstoasc -loglevel verbose -f flv "rtmp://servermedia.synker.ovh:1935/live/destroy live=1"
```

[image_ffmpeg]:https://github.com/opencoconut/ffmpeg
[docker_image]:https://github.com/illuspas/Node-Media-Server#readme