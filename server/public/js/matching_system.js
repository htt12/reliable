$(document).ready(initializeApp);

function initializeApp(){
    matchedUsersCheck();
    var matchedUserUsername;
    var userData;
    $('.arrow-left').on('click', showAllUsers);
    $('.arrow-right > i').on('click', showInterestedUsers);
}

function showAllUsers(){
    $('.interested-users').addClass('hidden').removeClass('show');
    $(".all-users").removeClass('hidden').addClass('show');
    $(".interested").css("background-color", "rgba(180, 213, 218, 0.5)");
    $(".all").css("background-color", "rgb(242, 197, 118)");
    getData();
}

function showInterestedUsers(){
    $(".all-users").removeClass('show').addClass('hidden');
    $(".interested-users").removeClass('hidden').addClass('show');
    $(".all").css("background-color", "rgba(180, 213, 218, 0.5)");
    $(".interested").css("background-color", "rgb(242, 197, 118)");
    matchedUsersCheck();
}

function matchedUsersCheck(){
    $.ajax({
        type: 'POST',
        url: '/matched',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        success: function(data){
            if(data.data[0]){
                getMatchedUserGoals(data);
                userData = data;
            } else {
                checkForInterestedMatches();
            }
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

function getMatchedUsername(){
    let matchedUser = userData.data[0].matched_user_id;
    let userId = userData.data[0].user_id;
    $.ajax({
        type: 'POST',
        url: '/getMatchedUsername',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        data: {
            matchedUser: matchedUser,
            userId: userId,
            
        },
        success: function(data){
            if(data.data[0]){
                console.log(data.data);
                matchedUserUsername = data.data[0].username;
            } else {
                var p = $("<p>").text("No goals for today").addClass('center');
                $(".match-list").append(p);
            }
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

function getMatchedUserGoals(data){
    var d = new Date();
    var n = d.getDay();
    var day = n;
    console.log("Day ======" + day);

    let matchedUser = data.data[0].matched_user_id;
    let userId = data.data[0].user_id;
    console.log(day);
    $.ajax({
        type: 'POST',
        url: '/matchedgoals',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        data: {
            matchedUser: matchedUser,
            userId: userId,
            day: day,
        },
        success: function(data){
            if(data.data[0]){
                console.log(data.data);
                $('.all-goals-list').empty();
                rendergoalOnDashboard(data.data);
                getMatchedUsername();
            } else {
                var p = $("<p>").text("No goals for today").addClass('center');
                $(".match-list").append(p);
            }
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

function checkForInterestedMatches(){
    $.ajax({
        type: 'POST',
        url: '/interestedMatching',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        data: {
        },
        success: function(resp){
            if(resp.data[0] !== undefined){
                $('.all-goals-list').empty();
                console.log(resp.data);
                rendergoalOnDashboardOLD(resp.data)
            } else {
                // getData();
                // var p = $("<p>").text("No users ready to match").addClass("center");
                // $(".match-list").append(p);
            }


        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}


function getData(category){
    $.ajax({
        type: 'POST',
        url: '/matching',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        data: {
            category: category,
        },
        success: function(resp){
            console.log("This is the possible matches====="+resp)
            var possibleMatches = resp.data;
            if(resp.data[0] !== undefined){
                // console.log(resp);
                $('.all-goals-list').empty();
                console.log(resp.data);
                rendergoalOnDashboardOLD(resp.data)
                var users = resp.data;
            } else {
                var p = $("<p>").text("No users ready to match").addClass("center");
                $(".match-list").append(p);
            }


        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}




// function editGoal(goalSelected, goalId){
//
//     let textToEdit = $(goalSelected).find('.goal-description');
//
//     $(goalSelected +'> .goal-description').text('');
//
//     $("<input class='center' type='text'>").css({
//         'margin': '3px',
//         'border-bottom': '3px yellow solid',
//         'height': '100%',
//         'width': '100%',
//
//     }).appendTo(textToEdit).focus();
//
//     $('input').on('focusout', ()=>{
//
//         let edit = $('input').val();
//
//         $(goalSelected+'> .goal-description').text(edit);
//
//         console.log(edit);
//         $('input').remove();
//
//
//         console.log('goalID', goalId);
//         $.ajax({
//             type: 'POST',
//             data: {
//                 goal: edit,
//                 goal_id: goalId,
//             },
//             url: '/goals/update',
//             // dataType: 'json',
//
//             success: function(resp){
//                 console.log('edit',resp);
//                 getData();
//             },
//             error: function(xhr, status, err){
//                 console.log(err)
//             }
//         })
//     })
// }

// function deleteGoal(goalId){
//     console.log('goalID', goalId);
//     $.ajax({
//         type: 'POST',
//         data: {
//             goal_id: goalId,
//         },
//         url: '/goals/delete',
//         // dataType: 'json',
//
//         success: function(resp){
//             console.log('delete',resp);
//             $('.goal-list').empty();
//             getData();
//         },
//         error: function(xhr, status, err){
//             console.log(err)
//         }
//     })
// }

// function deleteGoal(goalId){
//
//     $.ajax({
//         type: 'POST',
//         data: {
//             goal_id: goalId,
//         },
//         url: 'http://localhost:8000/goals/delete',
//         // dataType: 'json',
//
//         success: function(resp){
//             console.log('delete',resp);
//             $('.goal-list').empty();
//             getData();
//         },
//         error: function(xhr, status, err){
//             console.log(err)
//         }
//     })
// }

function rendergoalOnDashboard(goals){
    console.log('goals',goals);
    var users = [];
    for(var i=0; i<goals.length;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].goal;
        let goalId = goals[i].id;
        let userId =goals[i].id;
        let userName = goals[i].interested_username;
        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId);

        //Creates a container with the goal description
        var goalBar = $("<div>").addClass('goal-description partner-goal-description z-depth-3').text(goalDescription);

        //Creates drop down menu to mark goal as edit or delete
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container z-depth-3');

        var editButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button material-icons').attr('data-activates', 'dropdown'+goalId).text('menu');

        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+goalId);

        let goalSelector = '#goalId'+goalId;


        var editItem = $('<li>').addClass('edit center-align').on('click', ()=>{

                console.log(userId);
                sendInterestedMatches(userId);
            }
        ).wrapInner('<a href="#">Select</a>');

        var deleteItem = $('<li>').addClass('delete center').on('click', ()=>{
            getMatches(userId);
            // deleteGoal(goalId);
            // $(goalSelector).remove();
        }).wrapInner('<a>Find Match</a>');


        // dropDownList.append(editItem, deleteItem);


        // dropDownMenuButtonContainer.append(editButton,dropDownList);

        goalContainer.append(goalBar);

        $('.match-list').append(goalContainer);
        // $('.edit').wrapInner('<a href="#">edit</a>')
        $('.dropdown-trigger').dropdown();

    }

}


function rendergoalOnDashboardOLD(goals){
    console.log('goals',goals);
    $('.interested-users-cotainer').empty();
    $('.user-names').empty();
    if($(".interested-users-container").length <= 0){
        for(var i=0; i<goals.length;i++){
            //Gets goal description
            let goalDescription = goals[i].username;
            let goalId = goals[i].id;
            let userId =goals[i].user_id;
            //Creates goal container for each goal
            var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+userId,'username','username'+goalDescription);

            //Creates a container with the goal description
            var goalBar = $("<div>").addClass('goal-description z-depth-1');
            var userProfile = $("<div>").addClass('profileImg');
            var img = $("<img>").attr("src", "../images/default-user.png");
            userProfile.append(img);
            var user = $("<p>").addClass('user-name').text(goalDescription);
            goalBar.append(userProfile, user);

            //Creates drop down menu to mark goal as edit or delete
            var dropDownMenuButtonContainer = $('<div>').addClass('button-container z-depth-2');

            var editButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button material-icons').attr('data-activates', 'dropdown'+userId).text('menu');

            var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+userId,'username','dropdown'+goalDescription);

            let goalSelector = '#goalId'+goalId;


            var editItem = $('<li>').addClass('edit center-align').on('click', ()=>{
                console.log(goalId);
                sendInterestedMatches(userId,goalDescription);
                }
            ).wrapInner('<a href="#">Select</a>');

            var deleteItem = $('<li>').addClass('delete center').on('click', ()=>{
                getMatches(userId);
                console.log(userId);
                // deleteGoal(goalId);
                // $(goalSelector).remove();
            }).wrapInner('<a>Find Match</a>');


            dropDownList.append(editItem, deleteItem);


            dropDownMenuButtonContainer.append(editButton,dropDownList);

            goalContainer.append(goalBar, dropDownMenuButtonContainer);

            if(goals.length < 10){
                $('.interested-users-cotainer').append(goalContainer);
            } else {
                $('.user-names').append(goalContainer);
            }
            

            // $('.match-list').append(goalContainer);
            // $('.edit').wrapInner('<a href="#">edit</a>')
            $('.dropdown-trigger').dropdown();

        }

    }

}
function sendInterestedMatches(matchedUserId,username) {
    $.ajax({
        type: "POST",
        url: "/matchingusers",
        // dataType: "json",
        data: {
            username: username,
            matchedUserId: matchedUserId,
        },
        success: function (json_data) {
            var data = json_data;
            console.log('matched users', data);
        }

    })
}

function getMatches(matchedUserId) {
    
    console.log(matchedUserId);
    $.ajax({
        type: "POST",
        url: "/matchingpairs",
        // dataType: "json",
        data: {
            matchedUserId: matchedUserId,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
            if(data.data[0]){
                console.log(data);
                sendMatchToTable(data);
            }
            // sendMatchToTable(data);
        }

    })
}
function sendMatchToTable(data) {
    console.log(data);
    let userId = data.data[0].user_id;
    let interested_user_id = data.data[0].user_id2;
    console.log(userId, interested_user_id);
    $.ajax({
        type: "POST",
        url: "/matchedusers",
        data: {
            user_id: userId,
            matched_user_id: interested_user_id,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
            updateUsers(userId, interested_user_id);
        }

    })
}
function updateUsers(userId, interested_user_id) {
    $.ajax({
        type: "POST",
        url: "/users/update",
        data: {
            user_id: userId,
            matched_user_id: interested_user_id,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
            $(location).attr('href', 'https://relluo.com//matching_system.html')

        }

    })
}