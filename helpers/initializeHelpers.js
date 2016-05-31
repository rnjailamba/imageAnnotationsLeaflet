var exportedApp = require('./exporters/export_app');
var redisSetup = require('./Redis/setup.js');

var imageUploadAPI = require('./AmazonS3/imageUploadAPI.js');
exportedApp.app.use('/imageUploadAPI', imageUploadAPI.router);