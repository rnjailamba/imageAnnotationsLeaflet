var twilioClient;
module.exports.setTwilioClient = function(inClient) { 
	twilioClient = inClient; 
	module.exports.twilioClient = twilioClient;
};


