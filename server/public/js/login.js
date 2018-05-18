$(document).ready(enterKeyHandler);

function enterKeyHandler (event){
    
    let keyPressed = $('.loginFormContainer');
    
    keyPressed.on('keyup', (event) =>{
        event.preventDefault();
        if (event.keyCode === 13){
            $('.login-button').click();
          }
    })
}

function postUserToServer() {
    var email = $("#email").val();
    var password = $("#password").val();
    $.ajax({
        type: "POST",
        url: "/login",
        // dataType: "json",
        data: {
            email: email,
            password: password
        },
        success: function (json_data) {
            var data = json_data;
            if(data.errors === 'Invalid password or user'){
                $(".emailPwdInput, .input-feild, label").css("color","red");
            } else if (data.success === true){
                window.location = "/dashboard";
            }
            console.log("This is the data" + json_data);
            
        },
        error: function (xhr, status, error) {
            console.log(error)    
            $(".error-message").text("Invalid email/password")
            $(".emailPwdInput").css("color","red");
        }
    })
}


