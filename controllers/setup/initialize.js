var exportedApp = require('../../helpers/exporters/export_app');
var index = require('../index.js');

exportedApp.app.use('/', index.router);

