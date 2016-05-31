var redisClient;
module.exports.setRedisClient = function(inClient) { 
	redisClient = inClient; 
	module.exports.redisClient = redisClient;
};


