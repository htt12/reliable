$(document).ready(()=>{
    setTimeout(()=>{
        $('.loading').fadeOut(3000);
    }, 1000)
    }
);

function postUserToServer(email, password, status) {
    $.ajax({
        type: "POST",
        url: "http://reliable.keatonkrieger.com/login",
        dataType: "json",
        data: {
            email: email,
            password: password,
            status: status,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
        }
    })
}