$(document).ready(()=>{
    setTimeout(()=>{
        $('.loading').addClass('display', 'none');
    }, 500)
    }
);

function postUserToServer(email, password, status) {
    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "json",
        data: {
            email: email,
            password: password,
            status: status,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
        },
        error: function (xhr, status, error) {
            console.log(error)    
            $(".error-message").text("Invalid email/password")
        }
    })
}

