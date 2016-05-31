var modules = require("./all_modules.js");//simply loads all modules(for app), no initialisation/creation of object of module
var app = modules.express();


// VIEW ENGINE SETUP
// ==============================================
app.set('/views', modules.path.join(__dirname, '/views'));
app.set('view engine', 'ejs');// set up ejs for templating
app.use('/jquery', modules.express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', modules.express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/node_modules', modules.express.static(__dirname + '/node_modules/'));
app.use('/bower', modules.express.static(__dirname + '/bower_components/'));
app.use('/css', modules.express.static(__dirname + '/public/stylesheets/'));
app.use('/js', modules.express.static(__dirname + '/public/javascripts/'));
app.use('/img', modules.express.static(__dirname + '/public/images/'));
app.use(modules.flash()); // use connect-flash for flash messages stored in session
app.set('superSecret', modules.config.secret); // secret variable
app.use(modules.logger('dev')); // log every request to the console
app.set('trust proxy', 1) // trust first proxy


// USE BODY PARSER SO WE CAN GET INFO FROM POST AND/OR URL PARAMETERS
// ==============================================
app.use(modules.bodyParser.json());// get information from html forms // // parses json, x-www-form-urlencoded, and multipart/form-data
app.use(modules.bodyParser.urlencoded({ extended: false }));
//body parser not reccommended - http://stackoverflow.com/a/20132867/815929
app.use(modules.cookieParser("optional super secret"));// read cookies (needed for auth)
app.use(modules.express.static(modules.path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.cookie('fooo','bar');
  res.cookie('name','foo',{signed:true});
  next();
});


//THIS IS NOT DONE IN STARTING AS APP DIDNT HAVE REQUIRED PROPERTIES THEN
// ==============================================

var exportingApp = require("./helpers/exporters/export_app");
exportingApp.exportApp(app);
var initHelper = require("./helpers/initializeHelpers.js");//initialize database connections , twilio etc.
var initControllers = require("./controllers/setup/initialize.js");//initialize database connections , twilio etc.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
console.log("hellonew");

process.env.PORT = 3005;
module.exports = app;
