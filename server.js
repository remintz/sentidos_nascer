// server.js
// the main server file, where we start listening on localhost

// modules =================================================
var express         = require('express');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');

// configuration ===========================================
var app = express();

// set our port
var port = 1337;

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
app.listen(port);                
console.log('The server is open on port ' + port);

// expose app       
exports = module.exports = app;