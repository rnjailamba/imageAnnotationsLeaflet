var app;

module.exports.exportApp = function(inApp) {
	console.log("App intilized")
    app = inApp;
    module.exports.app = app;

};
