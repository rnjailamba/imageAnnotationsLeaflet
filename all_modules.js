var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var fs = require("fs");
var config = require('./config/config'); // get our config file
var unless = require('express-unless');
var cookieParser = require('cookie-parser');



module.exports.express = express;
module.exports.path = path;
module.exports.logger = logger;
module.exports.bodyParser = bodyParser;
module.exports.flash = flash;
module.exports.session = session;
module.exports.fs = fs;
module.exports.config = config;
module.exports.unless = unless;
module.exports.cookieParser = cookieParser;

