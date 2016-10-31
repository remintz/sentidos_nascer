// app/routes.js
// here we define all the server's routes (GET, POST, PUT or DELETE)

// modules =================================================
var config = require('./config/config');
var omxplayer = require('node-omxplayer');

// configuration ===========================================
module.exports = function (app) {
    // server routes ===========================================================
    // plays a video on the raspberry pi
    app.post('/api/start', startOmx);

    // functions ===============================================================
    function startOmx (req, res) {
        var videoPath = '/home/pi/videos/' + config.piNumber + '.mp4';

        console.log(videoPath);
        res.json({ 'success': true, 'playing': true });
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