// app/routes.js
// here we define all the server's routes (GET, POST, PUT or DELETE)

// modules =================================================
var sys = require('sys');
var exec = require('child_process').exec;
var config = require('./config/config');
var omxplayer = require('node-omxplayer');
var videoPlayer;

// configuration ===========================================
module.exports = function (app) {
    // server routes ===========================================================
    // starts a video on the raspberry pi
    app.post('/api/start', startOmx);
    // plays a video on the raspberry pi
    app.post('/api/play-pause', playOmx);
    // stops a video on the raspberry pi
    app.post('/api/stop',  stopOmx);
    // reboot the machine
    app.post('/api/reboot', reboot);
    // sync time 
    app.post('/api/time', syncTime);

    // functions ===============================================================
    function startOmx (req, res) {
        if (videoPlayer){
            res.json({ 'success': false, 'playing': true, 'delay': 0 });
            return;
        } 
        var videoPath = '/home/pi/videos/' + config.piNumber + '.mp4';
        var delay = 3000;
        videoPlayer = omxplayer(videoPath, 'hdmi', true);
        videoPlayer.pause();

        setTimeout(() => videoPlayer.play(), delay);

        res.json({ 'success': true, 'playing': true, 'delay': delay/1000 });
        console.log("start");
    }

     // time
     function syncTime (req, res) {
        exec("sudo /home/pi/relogio.sh", puts);  
        res.json({ 'success': true, 'playing': false });
        console.log("sync");
    }

    function playOmx (req, res) {
        if (videoPlayer){
            videoPlayer.play();
            res.json({'success': true, 'playing': true})
            console.log("play");
        }else{
            res.status(404);
            res.json({'success': false, 'playing': false})
            console.log("play");
        }
    }

    function stopOmx (req, res) {
        if (videoPlayer){
            videoPlayer.quit();
            videoPlayer = null;
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

