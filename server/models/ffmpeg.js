const Logger = require('./server/core/logger')

class FFpegService {

    
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }

    function Info(path) {
        /**
         * ffprobe -v quiet -print_format json -show_format -show_streams path
         */
        Logger.Info(`Getting info for ${path} video`);
        

    }
}

module.exports = FFpegService