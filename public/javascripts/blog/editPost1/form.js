jQuery(document).ready(function($){
    var formModal = $('.cd-user-modal'),
      formLogin = formModal.find('#cd-login'),
      formSignup = formModal.find('#cd-signup'),
      formForgotPassword = formModal.find('#cd-reset-password'),
      formForgotPasswordDetailsSignup = formModal.find('#cd-reset-password-enter-details-signup'),
      formEnterDetailsOTP = formModal.find('#cd-enter-details'),
      formEnterLoginDetailsToSignUp = formModal.find('#cd-login-enter-details'),

      formModalTab = $('.cd-switcher'),
      tabLogin = formModalTab.children('li').eq(0).children('a'),
      tabSignup = formModalTab.children('li').eq(1).children('a'),

      forgotPasswordLink = formLogin.find('.cd-form-bottom-message a'),
      backToLoginLink = formForgotPassword.find('.cd-form-bottom-message a'),
      backToForgetPasswordLinkResetPasswordEnterDetailsSignup = formForgotPasswordDetailsSignup.find('.cd-form-bottom-message a'),
      resendOTPLink = formEnterDetailsOTP.find('.cd-form-bottom-message a'),
      resendOTPLinkAtLogin = formEnterLoginDetailsToSignUp.find('.cd-form-bottom-message a'),

      sendOTPButton = formSignup.find('p .sendOTP'),
      signupButton = formEnterDetailsOTP.find('p .signUpButton'),

      loginButton = formLogin.find('p .loginButton'),
      loginButtonWithDetails = formEnterLoginDetailsToSignUp.find('p .loginButtonWithDetails'),

      logoutButton = $('.cd-signout');

      resetPasswordButton = formForgotPassword.find('p .resetButton'),
      resetPasswordButtonDetailsSignup = formForgotPasswordDetailsSignup.find('p .resetButtonDetails'),

      mainNav = $('.main-nav');

	if( $('.floating-labels').length > 0 ) floatLabels();
	

	//FLOAT LABELS
	// ==============================================
	function floatLabels() {
		var inputFields = $('.floating-labels .cd-label').next();
		inputFields.each(function(){
			var singleInput = $(this);
			//check if user is filling one of the form fields 
			checkVal(singleInput);
			singleInput.on('change keyup', function(){
				checkVal(singleInput);	
			});
		});
	}


	//CHECK VAL
	// ==============================================	
	function checkVal(inputField) {
		( inputField.val() == '' ) ? inputField.prev('.cd-label').removeClass('float') : inputField.prev('.cd-label').addClass('float');
	}


	//CHECK INPUT TEXT FIELD EMPTY
	// ==============================================
	function checkInputTextFieldEmpty(element,e){
		initializeTooltipster(element);
		var myfield = $(element).val();
		if(myfield.length == 0){
			$(element).tooltipster('show');
			return true;	

		}
		else{
			$(element).tooltipster('hide');	
			return false;	
		}

	}


	//INITIALIZE THE TOOLTIPSTER FOR ELEMENT
	// ==============================================
	function initializeTooltipster(element){
		$(element).tooltipster({
			autoClose:false,
			trigger:'custom',
			position: 'right',
		    functionInit: function(){
		        return $(element).siblings('#myfield_description').html();
		    }

		});
	}	


	//CHECK INPUT SELECT FIELD EMPTY
	// ==============================================
	function checkInputSelectFieldEmpty(element,e){
		initializeTooltipster(element);
		if (!$(element.concat(" option:selected")).val()) {
			$(element).tooltipster('show');		
			return true;	
		}
		else{
			$(element).tooltipster('hide');		
			return false;	
		}

	}	
    //IS LOGGED IN AND SHOW ALERT IF NOT
    // ==============================================
    function isLoggedInAlert(){

        var x = $.ajax({
            url:"/loginMiddleware/isLoggedIn",
            type: 'GET',
            async: true,
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('Am i logged in ( initial )?',response);
                if(response == true){
                  //do nothing
                   swal({   
                   	 	title: "You are logged in!",   
                   	 	text: "Happy writing",
                   	 	type:'success',   
                   	 	timer: 1500,   
          						allowEscapeKey:true,
          						allowOutsideClick:true,			 	
                   	 	showConfirmButton: false 
                   	});
                }
                else{
                  swal({
                      title: 'Please login to post your blog',
                   	  type:'success',   
                      text: 'Thank you :)',
                      showCancelButton: true,
                      closeOnConfirm: true,
                      cancelButtonText: "I will login later",
  					          confirmButtonColor: "#2ecc71",
                      showLoaderOnConfirm: true,
                      allowEscapeKey:true,
                      allowOutsideClick:true,
                    }, function(){
                    	loginSelected();
                    });
                }
            },
            error: function(response) {
                console.log('Error with register ' + response.statusText);
                console.log("error page");
            }
        });
    }
        isLoggedInAlert();



    //LOGIN SELECTED
    // ==============================================
    function loginSelected(){
      mainNav.children('ul').removeClass('is-visible');
      formModal.addClass('is-visible');
      formLogin.addClass('is-selected');
      formSignup.removeClass('is-selected');
      formEnterDetailsOTP.removeClass('is-selected');
      formForgotPassword.removeClass('is-selected');
      tabLogin.addClass('selected');
      tabSignup.removeClass('selected');
      formForgotPasswordDetailsSignup.removeClass('is-selected');
      formEnterLoginDetailsToSignUp.removeClass('is-selected');
      $('.cd-switcher').find('.selected').html("Sign in");
    }    


    //IS LOGGED IN AND SHOW ALERT IF NOT
    // ==============================================
    function isLoggedInCheck(blogData){

        // console.log(JSON.stringify(blogData),"blogData");
        var x = $.ajax({
            url:"/loginMiddleware/isLoggedIn",
            type: 'GET',
            async: true,
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
              console.log('Am i logged in?',response);
              if(response == true){
                 ajaxCallForUpdateBlog(blogData);
              }
              else{
                swal({
                  title: 'Please login to post your blog',
                  type:'success',   
                  text: 'Thank you :)',
                  closeOnConfirm: true,
                  confirmButtonColor: "#2ecc71",
                  showLoaderOnConfirm: true,
                  allowEscapeKey:true,
                  allowOutsideClick:true,
                }, function(){
                  loginSelected();// After this the handling is done in loginAsynWithCallbacks
                });
              }
            },
            error: function(response) {
                console.log('Error with register ' + response.statusText);
                console.log("error page");
            }
        });
    }


    //AJAX CALL FOR UPDATE BLOG
    // ==============================================
    function ajaxCallForUpdateBlog(data){
        console.log("in Update log ",data);
        $.ajax({
            url:"/blog/editPost1/"+blogId,
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('Blog submission succesfull',response);
                if(response.statusCode == 200 ){
                  window.location = "/blog/blogUpdateSummary?status=200";
                }
                else{
                  window.location = "/blog/blogUpdateSummary";
                }
            },
            error: function(response) {
                console.log('Error with blog submission ' + response.statusText);
                console.log("error page");
            }
        });
    } 


    //AJAX CALL FOR SUBMITTING BLOG
    // ==============================================
    function ajaxCallForSubmitBlog(data){
        console.log("in submit up ",data);
        $.ajax({
            url:"/blog/writePost1",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('Blog submission succesfull',response);
                if(response.statusCode == 200 ){
                	window.location = "/blog/blogSummary?status=200";
                }
                else{
                	window.location = "/blog/blogSummary";
                }
            },
            error: function(response) {
                console.log('Error with blog submission ' + response.statusText);
                console.log("error page");
            }
        });
    }	


    //CONVERT SIR TREVOR TEXT
    // ==============================================
    function convertSirTrevorData(sirTrevorText){
      var objectsirTrevorText = JSON.parse( sirTrevorText );   // { foo: "bar" }
      var convertedArray = new Array(); // or the shortcut: = []


      if(!isEmpty(objectsirTrevorText)){
          var obj = objectsirTrevorText["data"];
          console.log("in convertSirTrevorData ",JSON.stringify(obj),obj.length);
          var type;
          var data;
        for (var i=0; i<obj.length; i++){
            console.log("Item name: "+obj[i]['type']);

          for (var name in obj[i]) {
            switch(name){
              case 'type':
                          type = obj[i][name];
                          break;
              case 'data':
                          data = obj[i][name];
                          break;
              default:
                        alert("data type is not known by system");
            } 
          }// end inner for loop
          console.log(type);
          switch(type){
            case 'heading':
                          console.log(JSON.stringify(data['text']));
                          var headingElement = $('<h3>')
                                                    .text(data['text']);
                          var headingData = {};
                          headingData.text = headingElement[0].outerHTML;
                          headingData.paragraphType = "Text";
                          convertedArray.push(headingData);
                          break;
            case 'text':
                          console.log("text",JSON.stringify(data['text']));
                          var textData = {};
                          textData.text = data['text'];
                          textData.paragraphType = "Text";    
                          convertedArray.push(textData);                      
                          break;
            case 'list':
                          console.log(JSON.stringify(data["listItems"]));
                          var listobj = data["listItems"];
                          var list = document.createElement('ul');
                          for (var j=0; j<listobj.length; j++){
                            // Create the list item:
                            var item = document.createElement('li');
                            // Set its contents:
                            item.appendChild(document.createTextNode(listobj[j]["content"]));
                            // Add it to the list:
                            list.appendChild(item);
                          }   
                          console.log(list.outerHTML);
                          var listData = {};
                          listData.text = String(list.outerHTML);
                          listData.paragraphType = "Text";
                          convertedArray.push(listData);
                          break;
            case 'quote':
                          console.log(JSON.stringify(data['text']));
                          // console.log(JSON.stringify(data['cite']));
                          var quoteData = {};
                          quoteData.text = data['text'];
                          quoteData.paragraphType = "Text"; 
                          convertedArray.push(quoteData);                      
                          break;
            case 'image':
                          console.log(JSON.stringify(data['file']));
                          var imageData = {};
                          var imageURLs = new Array();

                          var singleImageData = {};
                          singleImageData.imageUrl = data['file']['url'];
                          imageURLs.push ( singleImageData );
                          imageData.imageList = imageURLs;
                          imageData.paragraphType = "Image";                          
                          convertedArray.push(imageData);                      
                          break; 
            case 'captioned_image':
                          console.log("captioned_image",JSON.stringify(data['file']));
                          var imageData = {};
                          var imageURLs = new Array();
                          var caption = data['text'];
                          //caption comes as <p>blabla</p> or <p></br></p> when empty
                          //will handle both the cases here so 
                          caption = $(caption);
                          captionText = caption[0].innerText;
                          var singleImageData = {};
                          if( captionText.trim().length > 0 ){
                            singleImageData.imageCaption = captionText.trim();
                            alert("caption is there");
                          }
                          singleImageData.imageUrl = data['file']['url'];
                          imageURLs.push ( singleImageData );
                          imageData.imageList = imageURLs;
                          imageData.paragraphType = "Image";                          
                          convertedArray.push(imageData);                      
                          break;                                                    
            case 'video':
                          console.log(JSON.stringify(data['source']));
                          console.log(JSON.stringify(data['remote_id']));
                          var videoData = {};
                          var videoURLs = new Array();
                          var source;
                          var videoUrl;

                          var singleVideoData = {};
                          // singleVideoData.videoCaption = "hello";
                          source = data['source'];
                          videoUrl = data['remote_id'];
                          if( source == "youtube"){
                            videoUrl = "https://www.youtube.com/watch?v=".concat(videoUrl);
                          }
                          else if( source == "vimeo" ){
                            videoUrl = "https://vimeo.com/".concat(videoUrl);
                          }
                          else{
                            console.log("not handling this video type");
                          }
                          singleVideoData.videoUrl = videoUrl;
                          videoURLs.push ( singleVideoData );

                          videoData.videoList = videoURLs;                          
                          videoData.paragraphType = "Video";                          
                          convertedArray.push(videoData);                      
                          break;
            default : console.log("this type is not known by system",type);
                      alert("this type is not known by system",type);

          }
        } // end outer for loop

        
      
      }
      else{
        alert(" is empty");
      }
      return convertedArray;
 
    }    


    //ISEMPTY
    // ==============================================
    function isEmpty(obj){
      return (Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({}));
    }


    //FILL IN TEXTFIELDS
    // ==============================================
    function fillInTextFields(){

      var title = blogContent.title;
      if(typeof title != 'undefined' && title != null){

        $('.myfield-title').val(title);

      }
     
      var categoryId = blogContent.categoryId;
      if(typeof categoryId != 'undefined' && categoryId != null){

        $('.category').val(categoryId);

      }

      var subCategoryId = blogContent.subCategoryId;
      if(typeof subCategoryId != 'undefined' && subCategoryId != null){

        $('.subcategory').val(subCategoryId);

      }   

      var name = blogContent.name;
      if(typeof name != 'undefined' && name != null){

        $('.myfield-name').val(name);

      }   

      var aboutUser = blogContent.aboutUser;
      if(typeof aboutUser != 'undefined' && aboutUser != null){

        $('.myfield-about').val(aboutUser);

      }                  
    } 


    // {
    //     "type": "list",
    //     "data": {
    //         "format": "html",
    //         "listItems": [
    //             {
    //                 "content": "fdfdfd\\f\\"
    //             },
    //             {
    //                 "content": "fdfd"
    //             },
    //             {
    //                 "content": ""
    //             }
    //         ]
    //     }
    // },


    //GET JSON FROM UL
    // ==============================================
    function getJsonFromUl(contents){

      var theListItems = new Array();

      var items = contents.find("li");
      var listText;
      for (var i = 0; i < items.length; ++i) {
        // console.log($(items[i])[0].innerHTML);
        listText = $(items[i])[0].innerHTML;
        if( listText && listText.length > 0 ){
          
          var data = {};
          data.content = listText;
          theListItems.push(data);

        }

      }
      // console.log(JSON.stringify(theListItems));
      return theListItems;
    }


    //GET FORMATTED TEXT DATA
    // ==============================================
    function getFormattedTextData(contents,tagName){

      var dataPush = {};
      var theText = {};
      var theList = {};
      switch(tagName){
        case "H3":
                  dataPush.type = "heading";
                  dataPush.data = theText;
                  theText.text = contents[0].outerHTML;
                  return dataPush;
        case "P":
                  dataPush.type = "text";
                  dataPush.data = theText;
                  theText.text = contents[0].outerHTML;        
                  return dataPush;
        case "UL":
                  dataPush.type = "list";
                  dataPush.data = {};
                  dataPush.data.listItems = getJsonFromUl(contents);
                  dataPush.data.format = "html";
                  return dataPush;                  
        default:
                break;                                    
      }

    }  


/* ======================================
     PARSE YOUTUBE URL
   ====================================== */
    function parseYoutubeUrl(videoUrl){
      var url = videoUrl;
      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        return match[2];
      } else {
          alert("not a youtube url");
      }
    }     


/* ======================================
     PARSE VIMEO URL
   ====================================== */
    function parseVimeoUrl(videoUrl){

      var url = videoUrl;
      var regExp =/http(s)?:\/\/(www\.)?vimeo.com\/(\d+)(\/)?(#.*)?/;

      var match = url.match(regExp);

      if (match){
          return match[3];
      }else{
          alert("not a vimeo url");
      }
    }        


    //GET FORMATTED VIDEO DATA
    // ==============================================
    function getFormattedVideoData(contents){

      var videoUrl = contents[0].videoUrl;
      // console.log(videoUrl);
      var dataPush = {};

      if( videoUrl.indexOf("youtube") > -1 ){
        var stripUniqueId = parseYoutubeUrl(videoUrl);
        dataPush.type = "video";
        dataPush.data = {};
        dataPush.data.source = "youtube";
        dataPush.data.remote_id = stripUniqueId;
        return dataPush;
      }    
      else if( videoUrl.indexOf("vimeo") > -1 ){
        var stripUniqueId = parseVimeoUrl(videoUrl);
        dataPush.type = "video";
        dataPush.data = {};
        dataPush.data.source = "vimeo";
        dataPush.data.remote_id = stripUniqueId;
        return dataPush;
      }      
    }  

    // {
    //     "type": "image",
    //     "data": {
    //         "file": {
    //             "url": "https://cementifyblogimages.s3-ap-southeast-1.amazonaws.com/1461129244236.jpg"
    //         }
    //     }
    // }

      // {
      //     "type": "captioned_image",
      //     "data": {
      //         "text": "<p>fdfdfd</p>",
      //         "format": "html",
      //         "file": {
      //             "url": "https://cementifyblogimages.s3-ap-southeast-1.amazonaws.com/1461129418305.jpg"
      //         },
      //         "caption": {
      //             "text": null
      //         }
      //     }
      // }


    //GET FORMATTED IMAGE CAPTION DATA
    // ==============================================
    function getFormattedCaptionData(dataPush,imageCaption){
      dataPush.type = "captioned_image";
      dataPush.data.text = imageCaption;
      dataPush.data.format = "html";
      dataPush.data.caption = {};
      dataPush.data.caption.text = null;
      return dataPush;
    }   


    //GET FORMATTED IMAGE DATA
    // ==============================================
    function getFormattedImageData(contents){

      var obj = contents;
      var imageUrl;
      var imageCaption;
      var dataPush = {};
      if(obj == null || typeof obj == 'undefined' || obj.length == 0 ) return;
      for (var i=0; i<obj.length; i++){
        imageUrl = obj[0].imageUrl;
        imageCaption = obj[0].imageCaption;
        dataPush.type = "image";
        dataPush.data = {};
        dataPush.data.file = {};
        dataPush.data.file.url = imageUrl;
        // if(imageCaption != null && typeof imageCaption != 'undefined' && imageCaption.length != 0 ){
        //   dataPush = getFormattedCaptionData(dataPush,imageCaption);
        // }
      }
      return dataPush;
    }                   


    //FILL IN SIRTREVOR AND INITIALIZE
    // ==============================================
    function fillInSirTrevorAndInitialize(){
      var paragraphs = blogContent["paragraphs"];
      var sirTrevorArray = new Array();
      console.log("paragraphs",JSON.stringify( paragraphs ));
      var obj = paragraphs;
      for (var i=0; i<obj.length; i++){
        var type = obj[i]["paragraphType"];
        var contents;
        var tagName;
        switch(type){
          case "Text":
                      contents = obj[i]["text"];
                      contents = $(contents);
                      tagName = contents[0].tagName;
                      sirTrevorArray.push(getFormattedTextData(contents,tagName));
                      break;
          case "Video":
                      contents = obj[i]["videoList"];
                      sirTrevorArray.push(getFormattedVideoData(contents));
                      break;
          case "Image":
                      contents = obj[i]["imageList"];
                      sirTrevorArray.push(getFormattedImageData(contents));                      
                      break;
          default:
                  break;                                                                  

        }

      } 
      sirTrevorData.data = sirTrevorArray;

      var x = {"data":[{"type":"heading","data":{"text":"<h3>Write your heading here</h3>"}},{"type":"text","data":{"text":"<p>Enter some text here</p>"}},{"type":"text","data":{"text":"<p>Enter more text or try adding images/youtube videos after pressing the '+' sign </p>"}}]};
      $('.js-st-instance').val(JSON.stringify(sirTrevorData));
      
      var stInstance  = new SirTrevor.Editor( {
          el: $('.js-st-instance'),
          defaultType: "Image",
  //        required: [
  //            "Heading",
  //            "Text"
  //          ],
           onEditorRender : function() {
                // this.block_manager.createBlock("OrderedList");
                // this.block_manager.createBlock("CaptionedImage");

              },
             blockTypes: [
                         "Text",
                         "Heading",
                         "Image",
                         // "CaptionedImage",
                         "List",
                         // "Quote",
                         // "Tweet",
                         "Video",
                         // "OrderedList",
                       ],
          onFormSubmit: function(){
              alert("form submitted");
          }
      });      
    }      

/* ======================================
     CREATE IMAGE EDIT ELEMENT
   ====================================== */
    function createImageEditElement(imageUrl){

      var outerMostDiv = $('<div>')
                              .attr("class", "list-group-item");   
      var photoImage = $('<img>')
                            .attr({ src:imageUrl, alt:"Image" })
                            .attr({ height:150, width:350 });



      var inputRadio = $('<input>')
                           .attr("type", "radio")
                           .attr("name", "coverImage")
                           .attr("value", imageUrl);
      var icon = $('<i>')
                      .attr("class", "js-remove")
                      .text('✖');

                

      outerMostDiv.append(photoImage);
      outerMostDiv.append(inputRadio);
      outerMostDiv.append(icon);
      
      return outerMostDiv;                                       

    } 

/* ======================================
     ADD IMAGES TO SORTABLE [ THE TODO LIST]
   ====================================== */
    function addImagesToSortable(imageUrl){  
      
      imageUrl = imageUrl.substring(0, imageUrl.indexOf(".jpg")+4);
      console.log(imageUrl);
      $('#listWithHandle').append(createImageEditElement(imageUrl));

    }            
    

/* ======================================
     LOOP THROUGH IMAGES 
   ====================================== */
    function loopThroughImages(imageList){  
      
      var obj = imageList;
      var photoImage;
      for (var i=0; i<obj.length; i++){
        var imageUrl = obj[i]["imageUrl"];
        addImagesToSortable(imageUrl);
      }

    }       


/* ======================================
     UPDATE IMAGE HANDLER
   ====================================== */
    function updateImageHandler(imageList){

      var obj = imageList;
      if( obj == null || typeof obj == 'undefined' || obj.length == 0 ){
        return;
      }
      else if( obj.length >= 1 ){
        return loopThroughImages(imageList);
      } 
      
    }         


    //ADD IMAGES
    // ==============================================
    function addImages(){
      
      $('#listWithHandle').empty();
      var obj = blogContent.paragraphs;
      // console.log("all stuff",obj);
      for (var i=0; i<obj.length; i++){
        switch( obj[i]["paragraphType"]){
          case 'Image':
                    var blogImage = updateImageHandler(obj[i]["imageList"]);
                    break;
          default:
                    break;
        }
      }      
    }


    //SHOW ALERT
    // ==============================================
    function showAlert(text){

        swal({   
                title: "Oops.....",   
                text: text,
                timer: 1500,   
                allowEscapeKey:true,
                allowOutsideClick:true,       
                showConfirmButton: true  
              });

    }         


    //COUNT IMAGES
    // ==============================================
    function countImages(sirTrevorText){
      var objectsirTrevorText = JSON.parse( sirTrevorText );   // { foo: "bar" }
      var cnt = 0;
      if(!isEmpty(objectsirTrevorText)){
         var obj = objectsirTrevorText["data"];
          var type;
          var data;
        for (var i=0; i<obj.length; i++){
          for (var name in obj[i]) {
            // console.log("Item name: "+name+obj[i][name]);
            switch(name){
              case 'type':
                          type = obj[i][name];
                          break;
            } 
          }// end inner for loop
          // console.log(type);
          switch(type){
            case 'image':
                          cnt++;                      
                          break; 
            case 'captioned_image':
                          cnt++;                      
                          break;
          }
        } // end outer for loop
      }
     
      return cnt; 
    }         


    //GET COVER IMAGE
    // ==============================================
    function getCoverImage(imageElements){
      var isChecked = $("input:radio[name='coverImage']").is(":checked");
      if( isChecked ){
        return $("input:radio[name='coverImage']:checked").val();
      }
      else{
        return null;
      }

    }        


    //ADD IMAGES TO ARRAY
    // ==============================================
    function addImagesToArray(imageElements){
     
      var imageURLsArray = new Array();
      for (var i = 0; i < imageElements.length; i++) {
        var $html = $(imageElements[i]);    
        var imageSrc = $html.attr('src');
        imageURLsArray.push ( {"imageUrl":imageSrc} );
      }  
      return imageURLsArray;

    }   
    //ON PAGE LOAD
    // ==============================================      
    $(document).ready(function(){

        fillInTextFields();
        fillInSirTrevorAndInitialize();
        addImages();

    });  


    //ON SUBMIT
    // ==============================================
  	$(document).ready(function(){
  		$('.cd-normal-form input[type="submit"]').click(function(e){
  			e.preventDefault();
  			var checkName = checkInputTextFieldEmpty('.myfield-name',e);
  			var checkAbout = checkInputTextFieldEmpty('.myfield-about',e);
  			// var checkPhone = checkInputTextFieldEmpty('.myfield-phone',e);
  			var checkTitle = checkInputTextFieldEmpty('.myfield-title',e);
  			var checkCategory = checkInputSelectFieldEmpty('.category',e);
  			var checkSubcategory = checkInputSelectFieldEmpty('.subcategory',e);
        var countImg;
        var coverImageUrl;
  		   	// as soon as a key is pressed on the keyboard, hide the tooltip.
  			$(window).keypress(function() {
  			  $('.myfield').tooltipster('hide');

  			});


  			if( !checkName && !checkTitle && !checkCategory && !checkSubcategory && !checkAbout){
  				var name = $('.myfield-name').val();
  				var about = $('.myfield-about').val();
  				// var phone = $('.myfield-phone').val();
  				var title = $('.myfield-title').val();
  				var category = $('.category').val();
  				var subcategory = $('.subcategory').val();			

          SirTrevor.onBeforeSubmit();
          SirTrevor.SKIP_VALIDATION = true;
          var sirTrevorText = $('.js-st-instance').val();
          // console.log(sirTrevorText,"sirTrevorText");
          var convertedArray = convertSirTrevorData(sirTrevorText);
          // console.log(JSON.stringify(convertedArray));  
          var blogData = {};        
  				blogData.name = name;
  				blogData.about = about;
  				// data.phone = phone;
  				blogData.title = title;
  				blogData.category = category;
  				blogData.subcategory = subcategory;
  				blogData.sirTrevorText = convertedArray;
  				// console.log(name,phone,title,category,subcategory,tinymceText,imageURLs);
          countImg = countImages(sirTrevorText);
          coverImageUrl = getCoverImage();
          blogData.coverImageUrl = coverImageUrl;

          if(countImg < 1){
            showAlert("You have not added any photos ! :)");
          }
          else if(coverImageUrl == null ){
            showAlert("You have not selected a cover photo ! :)");
          }
          else{

            publishAttemptedWithFullDataWritePost = true;
            isLoggedInCheck(blogData);
          }          
  	
  			}
  			else{
          showAlert("You have not filled up all the required fields above ! :)");
  			}

  		});
  	});		
});

