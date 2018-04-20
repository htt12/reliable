$(document).ready(initializeApp);

function initializeApp(){
    matchedUsersCheck();
    // getData();
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
            } else {
                getData();
            }
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

function getMatchedUserGoals(data){
    let matchedUser = data.data[0].matched_user_id;
    let userId = data.data[0].user_id;
    console.log("THis is the data" + data);
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
        },
        success: function(data){
            if(data){
                console.log(data.data);
                $('.all-goals-list').empty();
                $('.matchedUser').text(matchedUser);
                rendergoalOnDashboard(data.data)
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
            console.log(resp);
            $('.all-goals-list').empty();
            console.log(resp.data);
            rendergoalOnDashboardOLD(resp.data)
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
        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId);

        //Creates a container with the goal description
        var goalBar = $("<div>").addClass('goal-description z-depth-3').text(goalDescription);

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


        dropDownList.append(editItem, deleteItem);


        dropDownMenuButtonContainer.append(editButton,dropDownList);

        goalContainer.append(goalBar, dropDownMenuButtonContainer);

        $('.match-list').append(goalContainer);
        // $('.edit').wrapInner('<a href="#">edit</a>')
        $('.dropdown-trigger').dropdown();

    }

}


function rendergoalOnDashboardOLD(goals){
    console.log('goals',goals);
    var users = [];
    for(var i=0; i<goals.length;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].username;
        let goalId = goals[i].id;
        let userId =goals[i].id;
        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId);

        //Creates a container with the goal description
        var goalBar = $("<div>").addClass('goal-description z-depth-3').text(goalDescription);

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
            console.log(userId);
            // deleteGoal(goalId);
            // $(goalSelector).remove();
        }).wrapInner('<a>Find Match</a>');


        dropDownList.append(editItem, deleteItem);


        dropDownMenuButtonContainer.append(editButton,dropDownList);

        goalContainer.append(goalBar, dropDownMenuButtonContainer);

        $('.match-list').append(goalContainer);
        // $('.edit').wrapInner('<a href="#">edit</a>')
        $('.dropdown-trigger').dropdown();

    }

}



function sendInterestedMatches(matchedUserId) {
    $.ajax({
        type: "POST",
        url: "/matchingusers",
        // dataType: "json",
        data: {
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
        }

    })
}