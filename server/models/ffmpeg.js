const Logger = require('../core/logger')

class FFmpegService {


    constructor(liveServerUrl) {
        this.liveServerUrl = liveServerUrl;
    }

    /**
     * Get Video Command
     * @param {string} path 
     */
    InfoCommand(path) {
        /**
         * ffprobe -v quiet -print_format json -show_format -show_streams path
         */
        Logger.log(`Getting info for ${path} video`);
        return { command : `ffprobe -v quiet -print_format json -show_format -show_streams ${path}`};
    }

    /**
     * Get Live Command
     * @param {string} path 
     */
    LiveCommand(path, videoSize = '640x480') {
        /**
         * ffprobe -v quiet -print_format json -show_format -show_streams path
         */
        Logger.log(`Getting info for ${path} video`);
        let streamId = Math.random().toString(26).slice(2);
        return {
            streamUrl: `${this.liveServerUrl}/live/${streamId}`,
            command: `ffmpeg -re -i "${path}" -ar 22050 -ab 56k -acodec mp3 -r 25 -f flv -b:v 400k -s ${videoSize} "${this.liveServerUrl}/live/${streamId} live=1"`
        };
    }
}

module.exports = FFmpegService