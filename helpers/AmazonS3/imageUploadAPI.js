var modules = require('../../controllers/setup/all_modules');//require all modules that are shared by all controllers
var router = modules.express.Router();
var config = require('../../config/config.js');//require all modules that are shared by all controllers
var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-1';
var AWS_ACCESS_KEY_ID = config.amazonS3key;
var AWS_SECRET_ACCESS_KEY = config.amazonS3secret;
AWS.config.update({accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});
var s3 = new AWS.S3();
console.log('got the config for aws',config.amazonS3key,config.amazonS3secret);


//IMAGE UPLOAD HELPERS - START
// ==============================================
var time = Date.now || function() {
  return new Date;
};


// REPLACEPLACEHOLDER
// URL will be in form https://cementifyblogimages.s3-ap-southeast-1.amazonaws.com/placeholder.txt?AWSA....
// Replace placeholder in above string by epoch
// ==============================================
var replacePlaceholder = function(fileName){
    fileName = fileName.replace("placeholder",time()); // if you want only the first occurrence of "placeholder" to be replaced
    return fileName;
}


var presignedURLForImageUpload = function(){
    var params = {  Bucket: 'cementifyblogimages', 
    				Key: replacePlaceholder("placeholder.jpg"),    
    				ContentType: 'image;charset=UTF-8', 
					ACL: 'public-read',    				
    				Expires: 6000000};
    var url = s3.getSignedUrl('putObject', params);
    return url;
}

// ==============================================
//IMAGE UPLOAD HELPERS - END



// GETIMAGEURL
// ==============================================
router.post('/getImageURL', function(req, res, next) {
    var url = presignedURLForImageUpload();
    console.log("The URL is", url);
    res.status(200).send(url);
});




module.exports.router = router;

