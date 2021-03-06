# HOLO Media Server

[![Build Status](https://travis-ci.org/Fazzani/synker-media-server.svg?branch=master)](https://travis-ci.org/Fazzani/synker-media-server)

[ffmpeg Streaming guide][ffmpeg_streaming_guide]
> Based on this [docker image][docker_image] and this [image][image_ffmpeg] for testing with ffmpeg

> [ffmpeg commands guide][ffmpeg_commands]

[FFmpeg notes][ffmpeg_notes]

## Examples

```sh
sudo docker run -v=`pwd`:/tmp/ffmpeg opencoconut/ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c:v libx264 -c:a copy -bsf:a aac_adtstoasc \
-loglevel debug -f flv  "rtmp://servermedia.synker.ovh:1935/live/test live=1"

ffmpeg -i http://vismanx1.com:8080/live/kemal01/01kemal/11410.ts -c:v copy -c:a copy \
-loglevel debug -f flv  "rtmp://servermedia.synker.ovh:1935/live/test live=1"

ffmpeg -re -i http://downloads.4ksamples.com/downloads/Samsung_UHD_Soccer_Barcelona_Atletico_Madrid.ts \
 -c:v libx264 -c:a copy -bsf:a aac_adtstoasc -loglevel verbose -f flv "rtmp://servermedia.synker.ovh:1935/live/destroy live=1"

ffmpeg -re -i http://downloads.4ksamples.com/downloads/Samsung_UHD_Soccer_Barcelona_Atletico_Madrid.ts -vcodec libx264 -profile:v main -preset:v medium -r 24 -g 60  -b:v 64k -maxrate 2500k -bufsize 64k -filter:v scale="trunc(oha/2)2:720" -sws_flags lanczos+accurate_rnd -c:a copy -f flv "rtmp://servermedia.synker.ovh:1935/live/destroy live=1"

# video informations
ffmpeg -i https://heni.freeboxos.fr:22182/share/UOpN2G-tQoNH4ito/Films/No.Good.Deed.2014.FRENCH.720p.BluRay.x264-DesTroY/destroy-nogooddeed.mkv -hide_banner

ffprobe -v quiet -print_format json -show_format -show_streams \
"http://downloads.4ksamples.com/downloads/Samsung_UHD_Soccer_Barcelona_Atletico_Madrid.ts" | jq .
```

## Example 2

```sh
ffmpeg -re -i localFile.mp4 -c copy -f flv rtmp://server/live/streamName

ffmpeg -re -i "http://downloads.4ksamples.com/downloads/Samsung_UHD_Soccer_Barcelona_Atletico_Madrid.ts" \
 -ar 22050 -ab 56k -acodec mp3 -r 25 -f flv -b:v 400k -s 640x480 "rtmp://servermedia.synker.ovh:1935/live/destroy live=1"
```

The -re option tells FFmpeg to read the input file in realtime and not in the standard as-fast-as-possible manner. With -c copy (alias -acodec copy -vcodec copy ) I’m telling FFmpeg to copy the essences of the input file without transcoding, then to package them in an FLV container (-f flv) and send the final bitstream to an rtmp destination (rtmp://server/live/streamName).

## Videojs Player

- [x] Playlist ui integration
- [x] [ChromeCast plugin][chromecast]
- [ ] [Opensubtitle][opensubtitle] integration by using `npm install opensubtitles-api` package
- [ ] [Tmdb][tmdb] integration by using `npm i tmdb-node` package
- [ ] avi format not supported yet
- [ ] Saving playlist
- [ ] Sharing playlist
- [ ] Saving history in the localstorage

## TODO

- [ ] Auto restart Stream when fail
- [ ] Publish event join and leave stream via WebSocket
- [ ] Fix ports config
  - [ ] Virer le mapping des ports pour l'api nms (on passe déjà par redirection)
- [ ] Afficher la liste des streams en cours et pouvoir les jouer en temps réel
- [ ] Gestion des exceptions à travers d'un middleware for synker api
- [ ] Passer la config sur serveur nms dans un fichier json et la passer comme config pour swarm
- [x] Using [fluent ffmpeg package][fluent]
- [ ] Add [ffmpeg meta data][ffmpeg_meta_data]
- [ ] Sécuriser le serveur RTMP
- [ ] Recording à la demande
- [ ] Streamer avec les différentes résolutions (audio/video)

[image_ffmpeg]:https://github.com/opencoconut/ffmpeg
[docker_image]:https://github.com/illuspas/Node-Media-Server#readme
[ffmpeg_commands]:https://ffmpeg.org/ffmpeg.html
[fluent]:https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
[ffmpeg_streaming_guide]:https://trac.ffmpeg.org/wiki/StreamingGuide
[ffmpeg_meta_data]:https://wiki.multimedia.cx/index.php/FFmpeg_Metadata
[theme]:https://www.quackit.com/html/templates/download/view_source.cfm?template=/html/templates/download/bootstrap/bootstrap_4/bootstrap_4_template_1.html
[vid_4k]:http://downloads.4ksamples.com/downloads/SES.Astra.UHD.Test.2.2160p.UHDTV.HEVC.x265-LiebeIst.mkv
[vid_barca_4k]:http://downloads.4ksamples.com/downloads/Samsung_UHD_Soccer_Barcelona_Atletico_Madrid.ts
[chromecast]:https://github.com/silvermine/videojs-chromecast
[tmdb]:https://www.themoviedb.org/
[opensubtitle]:https://www.opensubtitles.org
[videojs]:https://videojs.com
[ffmpeg_notes]:./ffmpeg.md