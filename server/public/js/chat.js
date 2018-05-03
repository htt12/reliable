// $(document).ready(matchedUsersCheck);



// function matchedUsersCheck(){
//     $.ajax({
//         type: 'POST',
//         url: '/matched',
//         dataType: 'json',
//         jsonpCallback: 'callback',
//         crossDomain: true,
//         cache: false,
//         success: function(data){
            
//             if(data.data[0]){
//                 let roomId = data.data[0].roomid;
//                 sendRoomId(roomId);
//             } else {
//             }
//         },
//         error: function(xhr, status, err){
//             console.log(err)
//         }
//     })
// }


// function sendRoomId(roomId){

//     $.ajax({
//         type: 'POST',
//         url: '/roomId',
//         dataType: 'json',
//         jsonpCallback: 'callback',
//         crossDomain: true,
//         cache: false,
//         data: {
//             roomId: roomId,
//         },
//         success: function(data){
            
//         },
//         error: function(xhr, status, err){
//             console.log(err)
//         }
//     })
// }

// // $(()=>{
// //     var socket = io();
// //     $('form').submit(function(){
// //         socket.emit('chat message', $('#m').val());
// //         $('#m').val('');
// //         return false;
// //     });
// //     socket.on('chat message', function(msg){
// //         $('#messages').append($('<li>').text(msg));
// //         window.scrollTo(0, document.body.scrollHeight);
// //     });
// // });


// //     socket.on('connect', function () {
// //         socket.emit('room', roomId);
// //     });

// //     socket.on('message', function (data) {
// //         console.log('Incoming message:', data);
// //     });