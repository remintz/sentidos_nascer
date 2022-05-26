// app/routes.js
// here we define all the server's routes (GET, POST, PUT or DELETE)

// modules =================================================
var sys = require('sys');
var exec = require('child_process').exec;
var config = require('./config/config');
var omxplayer = require('node-omxplayer');
var videoPlayer;
var nowPlaying = false;


var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) {
    var timestamp = new Date().toISOString();
    log_file.write(timestamp + ' - ' + util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

// configuration ===========================================
module.exports = function (app) {
    // server routes ===========================================================
    // starts a video on the raspberry pi
    app.post('/api/start', startOmx);
    // plays/pauses a video on the raspberry pi
    app.post('/api/play-pause', playPauseOmx);
    // stops a video on the raspberry pi
    app.post('/api/stop',  stopOmx);
    // reboot the machine
    app.post('/api/reboot', reboot);
    // sync time 
    app.post('/api/time', syncTime);

    function setupVideo() {
        var videoPath = '/home/pi/videos/' + config.piNumber + '.mp4';
        var videoPlayer = omxplayer(videoPath, 'hdmi', true);
        return videoPlayer
    }

    // functions ===============================================================
    function startOmx (req, res) {
        if (videoPlayer){
            res.json({ 'success': false, 'playing': true, 'delay': 0 });
            return;
        } 
        videoPlayer = setupVideo();
        videoPlayer.pause();

        var delay = 5000;
        setTimeout(() => {
            videoPlayer.play();
            nowPlaying = true;
        }, delay);

        res.json({ 'success': true, 'playing': true, 'delay': delay/1000 });
        console.log("start with delay");
    }

     // time
     function syncTime (req, res) {
        exec("sudo /home/pi/relogio.sh", puts);  
        res.json({ 'success': true, 'playing': false });
        console.log("sync");
    }

    function playPauseOmx (req, res) {
        if (! videoPlayer) {
            videoPlayer = setupVideo();
            nowPlaying = false;
        }
        if (nowPlaying) {
            videoPlayer.pause();
            nowPlaying = false;
            res.json({'success': true, 'playing': false})
            console.log("pause");
            }
        else {
            videoPlayer.play();
            nowPlaying = true;
            res.json({'success': true, 'playing': true})
            console.log("play");
        }
    }

    function stopOmx (req, res) {
        if (videoPlayer){
            videoPlayer.quit();
            videoPlayer = null;
            nowPlaying = false;
            res.json({'success': true, 'playing': false})
            console.log("stop");
        }else{
            res.status(404);
            res.json({'success': false, 'playing': false})
            console.log("stop");
        }
    }

    function puts (error, stdout, stderr) { sys.puts(stdout)}

    // reboots
    function reboot (req, res) {
        exec("sudo reboot", puts);    
    }


};

