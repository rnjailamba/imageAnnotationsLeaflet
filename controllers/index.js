var modules = require('./setup/all_modules');//require all modules that are shared by all controllers
var router = modules.express.Router();
var config = require('../config/config.js');//require all modules that are shared by all controllers
var appConfig = require('../config/appConfig'); // configure service api urls in dev/prod/beta
var redisClient = require('../helpers/exporters/export_redisClient').redisClient;

// PING
// ==============================================
router.get('/ping', function(req, res){

    res.render('index/ping', { title: 'Express' });

});


// HOME
// ==============================================
router.get('/', function(req, res){

    res.render('index/home', { title: 'Express' });

});




var justPrintSomething = function(){
    console.log("print something");
}

module.exports.router = router;
