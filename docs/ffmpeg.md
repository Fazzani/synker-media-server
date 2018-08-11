# FFMPEG Notes

## FFMPEG TIPS

1. `-stream_loop number (input)`
  Set number of times input stream shall be looped. Loop 0 means no loop, loop -1 means infinite loop.
2. `-metadata[:metadata_specifier] key=value (output,per-metadata)`

   ```sh
   ffmpeg -i in.avi -metadata title="my title" out.flv
   ```

3. `demuxer`: Split video to many packets
4. `Stream copy`: It makes ffmpeg omit the decoding and encoding step for the specified stream, so it does only demuxing and muxing. It is useful for changing   the container format or modifying container-level metadata.
5. `Screenshot` video

   ```sh
   ffmpeg -i input_file.mp4 -ss 01:23:45 -vframes 1 output.jpg
   ```

6. Video File Information

   ```sh
   ffmpeg -i video.flv -hide_banner
   ```

7. Increase/Reduce Video Playback Speed

   ```sh
   ffmpeg -i video.mpg -vf "setpts=0.5*PTS" highspeed.mpg
   ```

8. Add Photo or Banner to Audio

   ```sh
   ffmpeg -loop 1 -i image.jpg -i Bryan\ Adams\ -\ Heaven.mp3 -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest output.mp4
   ```

9. Add subtitles to a Movie

   ```sh
   ffmpeg -i video.mp4 -i subtitles.srt -map 0 -map 1 -c copy -c:v libx264 -crf 23 -preset veryfast video-output.mkv
   ```
