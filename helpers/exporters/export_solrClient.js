var solrClient;
module.exports.setSolrClient = function(inClient) { 
	solrClient = inClient; 
	module.exports.solrClient = solrClient;
};


