const Logger = require('../core/logger')
var FfmpegCommand = require('fluent-ffmpeg');

class FFmpegService {

    constructor(io, liveServerUrl) {

        this.io = io;
        this.liveServerUrl = liveServerUrl;
    }

    /**
     * Get Video Command
     * @param {string} path 
     */
    InfoCommand(path, format = 'json') {
        /**
         * ffprobe -v quiet -print_format json -show_format -show_streams path
         */
        Logger.log(`Getting info for ${path} video`);
        return {
            command: `ffprobe -v quiet -print_format ${format} -show_format -show_streams "${path}"`
        };
    }

    /**
     * Get live command
     *
     * @param {string} path
     * @param {string} [audio_codec='mp3']
     * @param {string} [video_codec='libx264']
     * @param {string} [videoSize='640x480']
     * @param {string} [format='flv']
     * @param {string} [audio_bitrate='56k']
     * @param {string} [video_bitrate='400k']
     * @param {string} [audio_resolution='22050']
     * @param {string} [perset='veryfast']
     * @param {string} [aspect='4:3']
     * @param {string} [maxrate='3000k']
     * @returns
     * @memberof FFmpegService
     */
    LiveCommand(path, audio_codec = 'mp3', video_codec = 'libx264', videoSize = '640x?', format = 'flv', audio_bitrate = '128k', video_bitrate = '400k', audio_resolution = '22050', perset = 'veryfast', aspect = '4:3', maxrate = '3000k') {
        let streamId = Math.random().toString(26).slice(2);
        let $io = this.io;
        var command = new FfmpegCommand(path)
            .addOption('-acodec', 'aac')
            //.addOption('-b:v', '800k') -preset veryfast -maxrate 1984k -bufsize 3968k
            .addOption('-preset', perset)
            .addOption('-maxrate', maxrate)
            .addOption('-tune', 'zerolatency')
            .addOption('-b:a', audio_bitrate)
            .addOption('-g', '50')
            .inputOptions('-re')
            .inputOptions('-r 25')
            .size(videoSize)
            .aspect(aspect)
            .videoCodec(video_codec)
            .audioCodec('copy')
            .format(format)
            .on('start', function (commandLine) {
                Logger.log('Spawned Ffmpeg with command: ' + commandLine);
            }).on('codecData', function (data) {
                Logger.log('Input is ' + data.audio + ' audio ' + 'with ' + data.video + ' video');
            }).on('progress', function (progress) {
                Logger.log('Processing: ' + progress.percent + '% done');
                $io.sockets.emit("shellResultEvent", 'Processing: ' + progress.percent + '% done');
            }).on('stderr', function (stderrLine) {
                Logger.log('Stderr output: ' + stderrLine);
            }).on('end', function (stdout, stderr) {
                Logger.log('Transcoding succeeded !');
            }).save(`${this.liveServerUrl}/live/${streamId}`);

        Logger.log('command', command);
        return {
            streamUrl: `${this.liveServerUrl}/live/${streamId}`,
            command: `ffmpeg -re -i "${path}" -ar ${audio_resolution} -ab ${audio_bitrate} -metadata title="${path}" -metadata year="2010" -acodec ${audio_codec} -r 25 -f ${format} -b:v ${video_bitrate} -s ${videoSize} "${this.liveServerUrl}/live/${streamId} live=1"`
        };
    }
}

module.exports = FFmpegService