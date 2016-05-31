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
    function isLoggedIn(blogData){

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
            url:"/blog/writePost",
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


    //FILL IN DATA
    // ==============================================
    function fillInData(){
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
      

    }   


    //ON PAGE LOAD
    // ==============================================      
  $(document).ready(function(){

      fillInData();

  });  



    //ON SUBMIT
    // ==============================================
  $(document).ready(function(){
    $('.cd-normal-form input[type="submit"]').click(function(e){
      e.preventDefault();
      // var checkName = checkInputTextFieldEmpty('.myfield-name',e);
      // var checkAbout = checkInputTextFieldEmpty('.myfield-about',e);
      // var checkPhone = checkInputTextFieldEmpty('.myfield-phone',e);
      var checkTitle = checkInputTextFieldEmpty('.myfield-title',e);
      var checkCategory = checkInputSelectFieldEmpty('.category',e);
      var checkSubcategory = checkInputSelectFieldEmpty('.subcategory',e);

        // as soon as a key is pressed on the keyboard, hide the tooltip.
      $(window).keypress(function() {
        $('.myfield').tooltipster('hide');

      });

      var imageURLs = "";
      var imageURLsArray = new Array(); // or the shortcut: = []
      var i;
      for (i = 0; i < myDropzone.files.length; i++) {
        imageURLs += myDropzone.files[i].xhr.responseURL;
        imageURLsArray.push ( {"imageUrl":myDropzone.files[i].xhr.responseURL} );

      }
      if( !checkTitle && !checkCategory && !checkSubcategory){
        // var name = $('.myfield-name').val();
        // var about = $('.myfield-about').val();
        // var phone = $('.myfield-phone').val();
        var title = $('.myfield-title').val();
        var category = $('.category').val();
        var subcategory = $('.subcategory').val();      
        var tinymceText = tinyMCE.get('mytextarea').getContent();

        var blogData = {};
        // blogData.name = name;
        // blogData.about = about;
        // data.phone = phone;
        blogData.blogId = blogId;
        blogData.isVerified = true;
        blogData.title = title;
        blogData.category = category;
        blogData.subcategory = subcategory;
        blogData.tinymceText = tinymceText;
        blogData.imageURLs = imageURLsArray;
        console.log("imageURLsArray",JSON.stringify(blogData));
        publishAttemptedWithFullDataWritePost = true;
        console.log(title,category,subcategory,tinymceText,imageURLs);
        isLoggedIn(blogData);
  
      }
      else{
        sweetAlert("Oops...", "", "error");
          swal({   
                  title: "Oops.....",   
                  text: "You have not filled up all the required fields above ! :)",
                  type:'error',   
                  timer: 1500,   
                  allowEscapeKey:true,
                  allowOutsideClick:true,       
                  showConfirmButton: true  
                });
      }

    });
  });   
});