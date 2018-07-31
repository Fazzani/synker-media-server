# synker-media-server

[![Build Status](https://travis-ci.org/Fazzani/synker-media-server.svg?branch=master)](https://travis-ci.org/Fazzani/synker-media-server)

> Based on this [docker image][docker_image] and this [image][image_ffmpeg] for testing with ffmpeg

> [ffmpeg commands guide][ffmpeg_commands]

## Examples

```sh
sudo docker run -v=`pwd`:/tmp/ffmpeg opencoconut/ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c:v libx264 -c:a copy -bsf:a aac_adtstoasc \
-loglevel debug -f flv  "rtmp://servermedia.synker.ovh:1935/live/test live=1"

ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c:v copy -c:a copy \
-loglevel debug -f flv  "rtmp://servermedia.synker.ovh:1935/live/test live=1"

ffmpeg -re -i https://heni.freeboxos.fr:22182/share/UOpN2G-tQoNH4ito/Films/No.Good.Deed.2014.FRENCH.720p.BluRay.x264-DesTroY/destroy-nogooddeed.mkv \
 -c:v libx264 -c:a copy -bsf:a aac_adtstoasc -loglevel verbose -f flv "rtmp://servermedia.synker.ovh:1935/live/destroy live=1"

ffmpeg -re -i https://heni.freeboxos.fr:22182/share/UOpN2G-tQoNH4ito/Films/No.Good.Deed.2014.FRENCH.720p.BluRay.x264-DesTroY/destroy-nogooddeed.mkv -vcodec libx264 -profile:v main -preset:v medium -r 24 -g 60  -b:v 64k -maxrate 2500k -bufsize 64k -filter:v scale="trunc(oha/2)2:720" -sws_flags lanczos+accurate_rnd -c:a copy -f flv "rtmp://servermedia.synker.ovh:1935/live/destroy live=1"

# video informations
ffmpeg -i https://heni.freeboxos.fr:22182/share/UOpN2G-tQoNH4ito/Films/No.Good.Deed.2014.FRENCH.720p.BluRay.x264-DesTroY/destroy-nogooddeed.mkv -hide_banner

ffprobe -v quiet -print_format json -show_format -show_streams \
"https://heni.freeboxos.fr:22182/share/UOpN2G-tQoNH4ito/Films/Homefront.2013.FRENCH.BRRiP.XviD-CARPEDIEM/Homefront 2013 FRENCH BRRiP XviD-CARPEDIEM.avi" | jq .
```

## Example 2

```sh
ffmpeg -re -i localFile.mp4 -c copy -f flv rtmp://server/live/streamName
```

ffmpeg -re -i "https://heni.freeboxos.fr:22182/share/UOpN2G-tQoNH4ito/Films/Homefront.2013.FRENCH.BRRiP.XviD-CARPEDIEM/Homefront 2013 FRENCH BRRiP XviD-CARPEDIEM.avi" \
 -ar 22050 -ab 56k -acodec mp3 -r 25 -f flv -b:v 400k -s 640x480 "rtmp://servermedia.synker.ovh:1935/live/destroy live=1"

The -re option tells FFmpeg to read the input file in realtime and not in the standard as-fast-as-possible manner. With -c copy (alias -acodec copy -vcodec copy ) I’m telling FFmpeg to copy the essences of the input file without transcoding, then to package them in an FLV container (-f flv) and send the final bitstream to an rtmp destination (rtmp://server/live/streamName).

## TODO

- [ ] Clappr for testing videos
- [ ] Sécuriser le serveur RTMP
- [ ] Streamer à la demande
- [ ] Recording à la demande
- [ ] Streamer avec les différentes résolutions (audio/video)
- [ ] Une application de gestion des:
  - [ ] users/authentification
  - [ ] page de test avec les différentes options et qui prend en paramètre une vidéo

[image_ffmpeg]:https://github.com/opencoconut/ffmpeg
[docker_image]:https://github.com/illuspas/Node-Media-Server#readme
[ffmpeg_commands]:https://ffmpeg.org/ffmpeg.html