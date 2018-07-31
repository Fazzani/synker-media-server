const Logger = require('../core/logger')

class FFmpegService {


    constructor(liveServerUrl) {
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
     * Get Live Command
     * @param {video path} path 
     * @param {audio codec} audio_codec 
     * @param {video size} videoSize 
     * @param {video format} format 
     * @param {video bitrate} video_bitrate
     * @param {audio bitrate} audio_bitrate
     * @param {audio resolution} audio_resolution
     */
    LiveCommand(path, audio_codec = 'mp3', videoSize = '640x480', format = 'flv', audio_bitrate = '56k', video_bitrate = '400k', audio_resolution = '22050') {
        /**
         * ffprobe -v quiet -print_format json -show_format -show_streams path
         */
        Logger.log(`Getting live info for ${path} video`);
        let streamId = Math.random().toString(26).slice(2);
        return {
            streamUrl: `${this.liveServerUrl}/live/${streamId}`,
            command: `ffmpeg -re -i "${path}" -ar ${audio_resolution} -ab ${audio_bitrate} -metadata title="${path}" -metadata year="2010" -acodec ${audio_codec} -r 25 -f ${format} -b:v ${video_bitrate} -s ${videoSize} "${this.liveServerUrl}/live/${streamId} live=1"`
        };
    }
}

module.exports = FFmpegService