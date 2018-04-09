var userEmail = null;
var userName = null;
var userPwd = null;
var invalidEmail = true;

$(document).ready(initializeApp);

function initializeApp() {
    userEmail = getEmailInput();
    userName = getUsernameInput();
    userPwd = getPasswordInput();
    $('.signUpBtn').on('click', handleSignUpBtnClick);
}

function getEmailInput() {
    var email = '';
    const emailValidification = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    $('.emailInput').on('keyup', function (event) {
        email = event.target.value;
        // console.log('email1:', email);

        if( !emailValidification.test(email) ){

            var parent = $('.emailMsg');
            var child = $('.emailMsg span');
            var text = 'Please enter a valid email address';

            messageForInvalidInput( parent, child, text );

            invalidEmail = true;
        }
        else{
            invalidEmail = false;

            var parent = $('.emailMsg');
            var child = $('.emailMsg span');
            var text = 'Valid email address';

            messageForValidInput( parent, child, text );
        }
    });

    $('.emailInput').on('focusout', function () {
        console.log('outfocus - email:', email);
        return userEmail = email;
    });

}

function getUsernameInput() {
    var username = '';

    $('.usernameInput').on('keyup', function (event) {
        username = event.target.value;

        if( username.length < 8 ){

            var parent = $('.usernameMsg');
            var child = $('.usernameMsg span');
            var text = 'Username must contain at least 8 characters';

            messageForInvalidInput( parent, child , text);
        }
        else{
            var parent = $('.usernameMsg');
            var child = $('.usernameMsg span');
            var text = 'Valid username';

            messageForValidInput( parent, child , text);
        }
    });

    $('.usernameInput').on('focusout', function () {
        console.log('outfocus - username:', username);

        return userName = username;

    });
}

function getPasswordInput() {
    var pwd = '';

    $('.pwdInput').on('keyup', function (event) {
        pwd = event.target.value;
        pwd
        console.log('pwd.length:', pwd.length);

        if( pwd.length < 8 ){

            var parent = $('.pwdMsg');
            var child = $('.pwdMsg span');
            var text = 'Password must contains at least 8 characters';

            messageForInvalidInput( parent, child, text );
        }
        else{

            var parent = $('.pwdMsg');
            var child = $('.pwdMsg span');
            var text = 'Valid password';

            messageForValidInput( parent, child, text );
        }
    });

    $('.pwdInput').on('focusout', function () {
        console.log('outfocus - pwd:', pwd);
        return userPwd = pwd;
    });
}

function messageForInvalidInput( parentElement, childElement, text ) {
    parentElement.addClass('invalidInput').removeClass('validInput');
    var icon = $("<i>", {
        "class": "material-icons tiny valign-wrapper",
        text: "error_outline"
    });
    childElement.text( text );
    childElement.append(icon);
}

function messageForValidInput( parentElement, childElement, text) {
    parentElement.removeClass('invalidInput').addClass('validInput');
    var icon = $("<i>", {
        "class": "material-icons tiny valign-wrapper",
        text: "check"
    });
    childElement.text( text );
    childElement.append(icon);
}

function createObject( email, username, password ) {
    var object = {};
    object.email = email;
    object.username = username;
    object.password = password;
    sendData(email, username, password);
    return object;
}

function sendData(email, username, password) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8000/users",
        // dataType: "json",
        data: {
            email: email,
            username: username,
            password: password
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
        }

    })
}


function handleSignUpBtnClick() {

    if( userEmail === undefined || userName === undefined || userPwd === undefined || userName.length < 8 || userPwd.length < 8 || invalidEmail ){
        $('.message span').text("Please correct the error/errors above and try again").addClass('invalidInput');
        return;
    }
    else {
        var newObject = createObject( userEmail, userName, userPwd);
        console.log('new object:', newObject);
        $('.message span').text('');
        clearUserInput();
    }

}

function clearUserInput() {
    var icon = $("<i>", {
        "class": "material-icons tiny valign-wrapper",
        text: "error_outline"
    });
    $('.emailInput').val('');
    $('.emailMsg span').text('Please enter a valid email address').addClass('defaultColor').append(icon);
    $('.usernameInput').val('');
    $('.usernameMsg span').text('Username must contain at least 8 characters').addClass('defaultColor').append(icon);
    $('.pwdInput').val('');
    $('.pwdMsg span').text('Password must contains at least 8 characters').addClass('defaultColor').append(icon);

    invalidEmail = true;
}
