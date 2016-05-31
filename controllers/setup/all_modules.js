var express = require('express');
var config = require('../../config/config'); // get our config file
var Promise = require("bluebird"); // needed to simulate promises
var winston = require('winston'); // used for logging
var request = require('request'); // used to make http requests
var os = require('os'); // used to get OS information during sign up



module.exports.express = express;
module.exports.config = config;
module.exports.Promise = Promise;
module.exports.winston = winston;
module.exports.request = request;
module.exports.os = os;
