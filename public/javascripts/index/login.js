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

    var minPasswordLength = 8;

    loginSelected();

    
	//OPEN MODAL
	// ==============================================
	mainNav.on('click', function(event){
		$(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
	});


	//OPEN SIGN-UP FORM
	// ==============================================
	mainNav.on('click', '.cd-signup', signupSelected);


	//OPEN LOGIN-FORM FORM
	// ==============================================
	mainNav.on('click', '.cd-signin', loginSelected);


	// //CLOSE MODAL
	// // ==============================================
	// formModal.on('click', function(event){
	// 	if( $(event.target).is(formModal) || $(event.target).is('.cd-close-form') ) {
	// 		formModal.removeClass('is-visible');
	// 	}
	// });


	//CLOSE MODAL WHEN CLICKING THE ESC KEYBOARD BUTTON
	// ==============================================
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		formModal.removeClass('is-visible');
	    }
    });


	//SWITCH FROM A TAB TO ANOTHER
	// ==============================================
	formModalTab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( tabLogin ) ) ? loginSelected() : signupSelected();
	});


	//HIDE OR SHOW PASSWORD
	// ==============================================
	$('.hide-password').on('click', function(){
		var togglePass= $(this),
			passwordField = togglePass.prev('input');
	    // console.log("in hide",togglePass,passwordField);


		( 'password' == passwordField.attr('type') ) ? passwordField.attr('type', 'text') : passwordField.attr('type', 'password');
		( 'Hide' == togglePass.text() ) ? togglePass.text('Show') : togglePass.text('Hide');
		//focus and move cursor to the end of input field
		passwordField.putCursorAtEnd();
	});


	//SHOW FORGOT-PASSWORD FORM
	// ==============================================
	forgotPasswordLink.on('click', function(event){
		event.preventDefault();
		forgotPasswordSelected();
	});


	//BACK TO LOGIN FROM THE FORGOT-PASSWORD FORM
	// ==============================================
	backToLoginLink.on('click', function(event){
		event.preventDefault();
		loginSelected();
	});



    //BACK TO FORGOT PASSWORD FROM THE FORGOT-PASSWORD ENTER DETAILS FORM SIMULATING SIGNUP
    // ==============================================
    backToForgetPasswordLinkResetPasswordEnterDetailsSignup.on('click', function(event){
        event.preventDefault();
        forgotPasswordSelected();
    });



    //LOGOUT BUTTON
    // ==============================================
    logoutButton.click(function(event){ 
        event.preventDefault(); 
        ajaxCallForLogout();
    });


    //GO TO ENTER DETAILS AND OTP FOR SIGN UP
    // ==============================================
    sendOTPButton.on('click', function(event){
        var errMessage = formSignup.find('input[type="tel"]').hasClass('has-error');
        if(errMessage){
            formSignup.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        event.preventDefault();
        var phoneNumber = $('#mobile').val();
        // console.log(phoneNumber);
        if( checkNumber(phoneNumber) ){
            if( getlength(phoneNumber) !=10 ){
                formSignup.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
            }
            else{
                enterDetails();
                ajaxCallForOTP(phoneNumber);
            }
        }
        else{
            formSignup.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
    });


    //CLICK THE SIGNUP BUTTON
    // ==============================================
    signupButton.on('click', function(event){
        event.preventDefault();
        var errMessageEmail = formEnterDetailsOTP.find('input[type="email"]').hasClass('has-error');
        var errMessagePassword = formEnterDetailsOTP.find('input[type="password"]').hasClass('has-error');
        var errMessageIncorrectOTP = formEnterDetailsOTP.find('input[type="text"]').hasClass('has-error');
        var errMessageAgreeTerms = formEnterDetailsOTP.find('input[type="checkbox"]').hasClass('has-error');

        if( errMessageEmail ){
            formEnterDetailsOTP.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( errMessagePassword ){
            formEnterDetailsOTP.find('input[type="password"]').toggleClass('has-error').siblings('.cd-error-message').toggleClass('is-visible');
        }
        if( errMessageIncorrectOTP ){
            formEnterDetailsOTP.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( errMessageAgreeTerms ){
            formEnterDetailsOTP.find('input[type="checkbox"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }

        var signupEmail = $('#email').val();
        var signupPassword = $('#signup-password').val();
        var signupOTP = $('#signup-otp').val();

        var isCheckAgreeTerms = $('#' + 'accept-terms').is(":checked");
        var isValidEmail = isEmail(signupEmail); // Checks for ascii already
        var isPasswordEmpty = ( typeof signupPassword === 'undefined')?true:(signupPassword.length < minPasswordLength);
        var isPasswordASCII = isASCII(signupPassword);
         if( !isValidEmail ){
            formEnterDetailsOTP.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( isPasswordEmpty ){
            formEnterDetailsOTP.find('input[type="password"]').toggleClass('has-error').siblings('.cd-error-message').toggleClass('is-visible');
        }
        if( !isCheckAgreeTerms ){
            var x = formEnterDetailsOTP.find('input[type="checkbox"]');
            formEnterDetailsOTP.find('input[type="checkbox"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }

        if( isValidEmail && !isPasswordEmpty && isCheckAgreeTerms ){
            isOTPCorrect(signupOTP,1,otpInorrect,signupEmail,signupPassword);
        }
        else{
            isOTPCorrect(signupOTP,2,otpInorrect,signupEmail,signupPassword);
        }

    });


    function otpCorrect(response,signupEmail,signupPassword) {
        console.log('OTP verified succesfully',response,signupEmail,signupPassword);
        console.log("all details ok");
        ajaxCallForRegisterUser(signupEmail,signupPassword);
        return;
    }

    function otpInorrect(response) {
        formEnterDetailsOTP.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        console.log('Error with verifying OTP ' + response.statusText);
        return;

    }

    function otpCorrect1(response,signupEmail,signupPassword) {
        console.log('OTP verified succesfully',response,signupEmail,signupPassword);
        return;

    }


    //IS OTP CORRECT SIGN UP
    // ==============================================
    function isOTPCorrect(otp,correctCallback,otpInorrect,signupEmail,signupPassword){
        // console.log("checking otop ",otp);
        var data = {};
        data.otp = otp;

        var x = $.ajax({
            url:"/users/checkOTP",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response){
                if( correctCallback == 1) otpCorrect(response,signupEmail,signupPassword);
                else otpCorrect1(response,signupEmail,signupPassword);
            },
            error: otpInorrect
        })
          .done(function() {
            return true;
          })
          .fail(function() {
            return false;
          })
          .always(function() {

          });
          return;
    }


    //AJAX CALL FOR REGISTERING USER
    // ==============================================
    function ajaxCallForRegisterUser(signupEmail,signupPassword){
        // console.log("in sign up ",signupEmail,signupPassword);
        var data = {};
        data.signupEmail = signupEmail;
        data.signupPassword = signupPassword;

        $.ajax({
            url:"/users/registerUser",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('Register succesfully',response);
                location.reload();
            },
            error: function(response) {
                console.log('Error with register ' + response.statusText);
                console.log("error page");
            }
        });
    }


    //AJAX CALL FOR OTP - SENDS OTP TO USER AND SETS COOKIE WITH PHONE NUMBER
    // ==============================================
    function ajaxCallForOTP(phoneNumber){
        var data = {};
        data.phoneNumber = phoneNumber;

        $.ajax({
            url:"/users/sendOTPandSetCookie",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('OTP sent succesfully',response);
            },
            error: function(response) {
                console.log('Error with sending OTP ' + response.statusText);
            }
        });
    }


    //AJAX CALL FOR LOGOUT
    // ==============================================
    function ajaxCallForLogout(){

        $.ajax({
            url:"/users/logout",
            type: 'POST',
            async: true,
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('Logged out succesfully',response);
                location.reload();
            },
            error: function(response) {
                console.log('Error with logging out' + response.statusText);
            }
        });
    }


    //CLICK THE LOGIN BUTTON
    // ==============================================
    loginButton.on('click', function(event){

        event.preventDefault();
        var errMessagePhone = formLogin.find('input[type="tel"]').hasClass('has-error');
        var errMessagePassword = formLogin.find('input[type="password"]').hasClass('has-error');

        if( errMessagePhone ){
            formLogin.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( errMessagePassword ){
            formLogin.find('input[type="password"]').toggleClass('has-error').siblings('.cd-error-message').toggleClass('is-visible');
        }

        var loginPhone = $('#login-mobile').val();
        var loginPassword = $('#login-password').val();

        var isCheckRememberMe = $('#' + 'remember-me').is(":checked");
        var isValidPhone = (checkNumber(loginPhone) && getlength(loginPhone) == 10);
        var isPasswordEmpty = ( typeof loginPassword === 'undefined')?true:(loginPassword.length < minPasswordLength);
        var isPasswordASCII = isASCII(loginPassword);

        if( !isValidPhone ){
            formLogin.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( isPasswordEmpty ){
            formLogin.find('input[type="password"]').toggleClass('has-error').siblings('.cd-error-message').toggleClass('is-visible').html("Password length must be greater than equal to 8");
        }
        if( isValidPhone && !isPasswordEmpty ){
            ajaxCallForLogin(loginPhone,loginPassword);
        }

    });


    //AJAX CALL FOR LOGIN
    // ==============================================
    function ajaxCallForLogin(phoneNumber,signinPassword){
        var data = {};
        data.phoneNumber = phoneNumber;
        data.signinPassword = signinPassword;

        $.ajax({
            url:"/users/login",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('Login succesfully',response);
                location.reload();
            },
            error: function(response) {
                console.log('Error with logging in' + response.status);
                if( response.status == 404){
                    loginFailedNoAccount(phoneNumber,signinPassword);
                }
                else if( response.status == 401 ){
                    loginFailedNoMatch();// password and mobile do not match
                }
                else if( response.status == 400 ){
                    console.log("error page");
                }
            }
        });
    }

    function loginFailedNoAccount(phoneNumber,signinPassword){
        loginEnterDetails(phoneNumber,signinPassword);
        ajaxCallForOTP(phoneNumber);
    }

    function loginFailedNoMatch(){
        formLogin.find('input[type="password"]').toggleClass('has-error').siblings('.cd-error-message').toggleClass('is-visible').html("Incorrect Password");
    }


    //CLICK THE LOGIN BUTTON WITH DETAILS BUTTON
    // ==============================================
    loginButtonWithDetails.on('click', function(event){

        event.preventDefault();
        var errMessageEmail = formEnterLoginDetailsToSignUp.find('input[type="email"]').hasClass('has-error');
        var errMessageIncorrectOTP = formEnterLoginDetailsToSignUp.find('input[type="text"]').hasClass('has-error');

        if( errMessageEmail ){
            formEnterLoginDetailsToSignUp.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( errMessageIncorrectOTP ){
            formEnterLoginDetailsToSignUp.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }

        var loginEmail = $('#login-email').val();
        var loginOTP = $('#login-otp').val();
        var loginPassword = $('#login-password').val();

        var isValidEmail = isEmail(loginEmail); // Checks for ascii already

        if( !isValidEmail ){
            formEnterLoginDetailsToSignUp.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }

        if(isValidEmail ){
            isOTPCorrectLogin(loginOTP,loginEmail,loginPassword,1);
        }
        else{
            isOTPCorrectLogin(loginOTP,loginEmail,loginPassword,2);
        }

    });

    function otpCorrectForLogin(response,signupEmail,signupPassword) {
        console.log('OTP verified succesfully for login',response,signupEmail,signupPassword);
        console.log("all details ok for login");
        ajaxCallForRegisterUser(signupEmail,signupPassword);
        return;
    }

    function otpInorrectForLogin(response) {
        formEnterLoginDetailsToSignUp.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        console.log('Error with verifying OTP for login ' + response.statusText);
        return;

    }

    function otpCorrectForLogin1(response,signupEmail,signupPassword) {
        console.log('OTP verified succesfully for login',response,signupEmail,signupPassword);
        return;

    }


    //IS OTP CORRECT SIGN IN
    // ==============================================
    function isOTPCorrectLogin(loginOTP,loginEmail,loginPassword,correctCallback){
        // console.log("checking otop ",otp);
        var data = {};
        data.otp = loginOTP;

        var x = $.ajax({
            url:"/users/checkOTP",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response){
                if( correctCallback == 1) otpCorrectForLogin(response,loginEmail,loginPassword);
                else otpCorrectForLogin1(response,loginEmail,loginPassword);
            },
            error: function(response){
                if( response.status == 404){
                    otpInorrectForLogin(response);
                }
                else if( response.status == 400 ){
                    console.log("error page");
                }
            }
        })
          .done(function() {
            return true;
          })
          .fail(function() {
            return false;
          })
          .always(function() {

          });
          return;
    }


    //RESEND OTP SO GO BACK TO ENTER PHONE
    // ==============================================
    resendOTPLink.on('click', function(event){
        event.preventDefault();
        signupSelected();
    });


    //RESEND OTP SO GO BACK TO ENTER PHONE TO LOGIN
    // ==============================================
    resendOTPLinkAtLogin.on('click', function(event){
        event.preventDefault();
        loginSelected();
    });


    //CLICK THE RESET PASSWORD
    // ==============================================
    resetPasswordButton.on('click', function(event){

        var errMessage = formForgotPassword.find('input[type="tel"]').hasClass('has-error');
        if(errMessage){
            formForgotPassword.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        event.preventDefault();

        var phoneNumber = $('#mobileForgot').val();
        // console.log(phoneNumber);
        if( checkNumber(phoneNumber) ){
            if( getlength(phoneNumber) !=10 ){
                formForgotPassword.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
            }
            else{
                forgotPasswordEnterDetails();
                forgotPasswordEnterDetailsSignup();
                ajaxCallForOTP(phoneNumber);
            }
        }
        else{
            formForgotPassword.find('input[type="tel"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
    });



    //CLICK THE RESET BUTTON DETAILS SIMULATE SIGNUP
    // ==============================================
    resetPasswordButtonDetailsSignup.on('click', function(event){

        event.preventDefault();
        var errMessageEmail = formForgotPasswordDetailsSignup.find('input[type="email"]').hasClass('has-error');
        var errMessagePassword = formForgotPasswordDetailsSignup.find('input[type="password"]').hasClass('has-error');
        var errMessageIncorrectOTP = formForgotPasswordDetailsSignup.find('input[type="text"]').hasClass('has-error');
        var errMessageAgreeTerms = formForgotPasswordDetailsSignup.find('input[type="checkbox"]').hasClass('has-error');

        if( errMessageEmail ){
            formForgotPasswordDetailsSignup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( errMessagePassword ){
            formForgotPasswordDetailsSignup.find('input[type="password"]').toggleClass('has-error').siblings('.cd-error-message').toggleClass('is-visible');
        }
        if( errMessageIncorrectOTP ){
            formForgotPasswordDetailsSignup.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( errMessageAgreeTerms ){
            formForgotPasswordDetailsSignup.find('input[type="checkbox"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }

        var resetEmail = $('#reset-email-signup').val();
        var resetPassword = $('#reset-password-signup').val();
        var resetOTP = $('#reset-otp-signup').val();

        var isCheckAgreeTerms = $('#' + 'accept-terms-reset-password-signup').is(":checked");
        var isValidEmail = isEmail(resetEmail); // Checks for ascii already
        var isPasswordEmpty = ( typeof resetPassword === 'undefined')?true:(resetPassword.length < minPasswordLength);
        var isPasswordASCII = isASCII(resetPassword);
                console.log(isCheckAgreeTerms);

        if( !isValidEmail ){
            formForgotPasswordDetailsSignup.find('input[type="email"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }
        if( isPasswordEmpty ){
            formForgotPasswordDetailsSignup.find('input[type="password"]').toggleClass('has-error').siblings('.cd-error-message').toggleClass('is-visible');
        }
        if( !isCheckAgreeTerms ){
            var x = formForgotPasswordDetailsSignup.find('input[type="checkbox"]');
            formForgotPasswordDetailsSignup.find('input[type="checkbox"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        }

        if( isValidEmail && !isPasswordEmpty && isCheckAgreeTerms ){
            isOTPCorrectResetPasswordSignup(resetOTP,1,otpInorrectResetPasswordSignup,resetEmail,resetPassword);
        }
        else{
            isOTPCorrectResetPasswordSignup(resetOTP,2,otpInorrectResetPasswordSignup,resetEmail,resetPassword);
        }

    });


    function otpCorrectResetPasswordSignup(response,resetEmail,resetPassword) {
        console.log('OTP verified succesfully for reset signup',response,resetEmail,resetPassword);
        console.log("all details ok");
        ajaxCallForResettingPassword(resetEmail,resetPassword);
        return;
    }

    function otpInorrectResetPasswordSignup(response) {
        formForgotPasswordDetailsSignup.find('input[type="text"]').toggleClass('has-error').next('span').toggleClass('is-visible');
        console.log('Error with verifying OTP for reset as signup' + response.statusText);
        return;

    }

    function otpCorrectResetPasswordSignup1(response,resetEmail,resetPassword) {
        console.log('OTP verified succesfully',response,resetEmail,resetPassword);
        return;

    }


    //IS OTP CORRECT SIGN UP
    // ==============================================
    function isOTPCorrectResetPasswordSignup(resetOTP,correctCallback,incorrectOtpCallback,resetEmail,resetPassword){
        // console.log("checking otop ",otp);
        var data = {};
        data.otp = resetOTP;

        var x = $.ajax({
            url:"/users/checkOTP",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response){
                if( correctCallback == 1) otpCorrectResetPasswordSignup(response,resetEmail,resetPassword);
                else otpCorrectResetPasswordSignup1(response,resetEmail,resetPassword);
            },
            error: incorrectOtpCallback
        })
          .done(function() {
            return true;
          })
          .fail(function() {
            return false;
          })
          .always(function() {

          });
          return;
    }


    //AJAX CALL FOR RESETTING PASSWORD - SIMILAR TO REGISTERING USER
    // ==============================================
    function ajaxCallForResettingPassword(resetEmail,resetPassword){
        // console.log("in resetPassword ",resetEmail,resetPassword);
        var data = {};
        data.resetEmail = resetEmail;
        data.resetPassword = resetPassword;

        $.ajax({
            url:"/users/resetPassword",
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            cache: false,
            processData: false,
            success: function(response) {
                console.log('Reset password succesfully',response);
                location.reload();
            },
            error: function(response) {
                console.log('Error with reset password ' + response.statusText);
                console.log("error page");
            }
        });
    }


    //GET LENGTH
    // ==============================================
    function getlength(phoneNumber) {
        return phoneNumber.toString().length;
    }


    //CHECK NUMBER
    // ==============================================
    function checkNumber(phoneNumber)
    {
        var x=phoneNumber;
        if (isNaN(x))
        {
            return false;
        }
        else{
            return true;
        }
    }


    //IS EMAIL
    // ==============================================
    function isEmail(email){
         var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
         return regex.test(email);
    }


    //IS ASCII
    // ==============================================
    function isASCII(text){
         var regex = /^[\x20-\x7E]+$/;
         return regex.test(text);
    }


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


    //SIGNUP SELECTED
    // ==============================================
	function signupSelected(){
		mainNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formLogin.removeClass('is-selected');
	    formEnterDetailsOTP.removeClass('is-selected');
        formForgotPasswordDetailsSignup.removeClass('is-selected');        
		formSignup.addClass('is-selected');
		formForgotPassword.removeClass('is-selected');
		tabLogin.removeClass('selected');
		formEnterLoginDetailsToSignUp.removeClass('is-selected');
		tabSignup.addClass('selected');

	}


    //ENTER DETAILS FOR SIGN UP
    // ==============================================
	function enterDetails(){
        formLogin.removeClass('is-selected');
		formSignup.removeClass('is-selected');
		formForgotPassword.removeClass('is-selected');
        formForgotPasswordDetailsSignup.removeClass('is-selected');        
		formEnterLoginDetailsToSignUp.removeClass('is-selected');
		formEnterDetailsOTP.addClass('is-selected');
    }


    //FORGOT PASSWORD SELECTED
    // ==============================================
	function forgotPasswordSelected(){
		formLogin.removeClass('is-selected');
		formSignup.removeClass('is-selected');
		formEnterDetailsOTP.removeClass('is-selected');
        formForgotPasswordDetailsSignup.removeClass('is-selected');
	    formEnterLoginDetailsToSignUp.removeClass('is-selected');
		formForgotPassword.addClass('is-selected');
        $('.cd-switcher').find('.selected').html("Forgot Password");

	}

    //ENTER DETAILS FOR FORGOT PASSWORD
    // ==============================================
    function forgotPasswordEnterDetails(){
        formLogin.removeClass('is-selected');
        formSignup.removeClass('is-selected');
        formForgotPassword.removeClass('is-selected');
        formForgotPasswordDetailsSignup.removeClass('is-selected');        
        formEnterDetailsOTP.removeClass('is-selected');
		formEnterLoginDetailsToSignUp.removeClass('is-selected');
        $('.cd-switcher').find('.selected').html("Forgot Password");
    }

    //ENTER DETAILS FOR FORGOT PASSWORD SIMULATES SIGNUP
    // ==============================================
    function forgotPasswordEnterDetailsSignup(){
        formLogin.removeClass('is-selected');
        formSignup.removeClass('is-selected');
        formForgotPassword.removeClass('is-selected');
        formForgotPasswordDetailsSignup.addClass('is-selected');        
        formEnterDetailsOTP.removeClass('is-selected');
        formEnterLoginDetailsToSignUp.removeClass('is-selected');
        $('.cd-switcher').find('.selected').html("Forgot Password");
    }

    //ENTER DETAILS FOR SIGN IN [SIMULATES SIGN UP]
    // ==============================================
    function loginEnterDetails(){
        formLogin.removeClass('is-selected');
        formSignup.removeClass('is-selected');
        formForgotPassword.removeClass('is-selected');
        formForgotPasswordDetailsSignup.removeClass('is-selected');
        formEnterDetailsOTP.removeClass('is-selected');
        formEnterLoginDetailsToSignUp.addClass('is-selected');
    }


	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	// ==============================================
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}

});


//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
// ==============================================
jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		// ... then use it (Doesn't work in IE)
      		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      		var len = $(this).val().length * 2;
      		this.focus();
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};