// app/routes.js
// here we define all the server's routes (GET, POST, PUT or DELETE)

// modules =================================================
var config = require('./config/config');
var omxplayer = require('node-omxplayer');
var videoPlayer;

// configuration ===========================================
module.exports = function (app) {
    // server routes ===========================================================
    // starts a video on the raspberry pi
    app.post('/api/start', startOmx);
    // plays a video on the raspberry pi
    app.post('/api/play', playOmx);
    // pauses a video on the raspberry pi
    app.post('/api/pause', pauseOmx);
    // stops a video on the raspberry pi
    app.post('/api/stop',  stopOmx);

    // functions ===============================================================
    function startOmx (req, res) {
        var videoPath = '/home/pi/videos/' + config.piNumber + '.mp4';
        videoPlayer = omxplayer(videoPath, 'hdmi', true);

        console.log(videoPath);
        res.json({ 'success': true, 'playing': true });
    }

    function playOmx (req, res) {
        if (videoPlayer){
            videoPlayer.play();
            res.json({'success': true, 'playing': true})
        }else{
            res.status(404);
            res.json({'success': false, 'playing': false})
        }
    }

    function pauseOmx (req, res) {
        if (videoPlayer){
            videoPlayer.pause();
            res.json({'success': true, 'playing': false})
        }else{
            res.status(404);
            res.json({'success': false, 'playing': false})
        }
    }

    function stopOmx (req, res) {
        if (videoPlayer){
            videoPlayer.quit();
            res.json({'success': true, 'playing': false})
        }else{
            res.status(404);
            res.json({'success': false, 'playing': false})
        }
    }


    // // plays a video on the raspberry pi
    // function playVideo(req, res) {
    //     // checks if params were passed
    //     if (!req.body.video) {
    //         // no video to play, return error
    //         res.status(404);
    //         res.send('Please provide a video to play on the Pi');
    //     } else {
    //         // there is a video to play, keep going
    //         var videoPath = '/home/pi/videos/' + req.body.video

    //         var videoPlayer = omxplayer(videoPath);

    //         res.json({ 'success': true, 'playing': true });
    //     }
    // }
};