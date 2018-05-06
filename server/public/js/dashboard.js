
$(document).ready(initializeApp);
// var userID = require('../app');
// console.log(userID);

// console.log(req.session.id);

function initializeApp(){
    getData();
    displayDate();
}

function displayDate(){
    let todayDate = getTodayDate();
    console.log('today',todayDate);

    $('.date').text(todayDate);
}

function getTodayDate(){
    var date = new Date();
    var day = date.getDay();
    var dd = leadingZero(date.getDate());
    var mm = leadingZero(date.getMonth()+1);
    let dayOfWeek = convertToDayOfWeek(day);
    // var yyyy = date.getFullYear();
    return (dayOfWeek+ '  ' +mm+'/'+dd);
}

function leadingZero( num ) {
    if( num<10 ){
        return '0'+num;
    }
    else{
        return num;
    }
}

function convertToDayOfWeek( day ) {

    if( day === 0){
        return "SUN";
    }
    else if( day === 1){
        return "MON";
    }
    else if( day === 2) {
        return "TUES";
    }
    else if( day === 3) {
        return "WED";
    }
    else if( day === 4) {
        return "THURS";
    }
    else if( day === 5) {
        return "FRI";
    }
    else if( day ===6) {
        return  "SAT";
    }
}

function getData(){
    let d = new Date();
    let n = (d.getUTCDay());
    console.log('n',n)
    $.ajax({
        type: 'POST',
        url: '/goalssqlday',
        data: {
            day:n
        },
        success: function(resp){
            console.log('dashboard',resp);

            // rendergoalOnDashboard(resp.data)
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

// ***************** TESTING *************************
var object = [
    {
        goal: 'make it work make it work make it work make it work make it work make it work make it work make it work make it work make it work',
        goal_id: 88,
        day: 3,
        timeframe: 2
    },
    {
        goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
        goal_id: 8,
        day: 3,
        timeframe: 3
    },
    {
        goal: 'make it work',
        goal_id: 18,
        day: 5,
        timeframe: 2
    },
    {
        goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
        goal_id: 8,
        day: 2,
        timeframe: 1
    },
    {
        goal: 'make it work make it work make it work',
        goal_id: 10,
        day: 4,
        timeframe: 2
    },
    {
        goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
        goal_id: 8,
        day: 5,
        timeframe: 2
    },
    {
        goal: 'make it work make it work make it work',
        goal_id: 88,
        day: 2,
        timeframe: 1
    },
    {
        goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
        goal_id: 8,
        day: 5,
        timeframe: 2
    },
    {
        goal: 'make it work make it work make it work',
        goal_id: 88,
        day: 2,
        timeframe: 1
    },
    {
        goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
        goal_id: 8,
        day: 5,
        timeframe: 2
    },
    {
        goal: 'make it work make it work make it work',
        goal_id: 88,
        day: 2,
        timeframe: 1
    },
    {
        goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
        goal_id: 8,
        day: 5,
        timeframe: 2
    },
    {
        goal: 'make it work make it work make it work',
        goal_id: 88,
        day: 2,
        timeframe: 1
    }
]

rendergoalOnDashboard(object);

// ***************************************************


function rendergoalOnDashboard(goals){
    console.log('goals',goals);
    var users = [];

    if(goals.length !== 0){
        $(".message").addClass('hidden');
    }

    for(var i=0; i<goals.length;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].goal;
        let goalId = goals[i].goal_id;
        //let timeOfDay = 'rgb(15, 65, 119, 0.6)';
        let timeImage = 'images/moon.png'
        switch (parseInt(goals[i].timeframe)){
            case 1:
                //timeOfDay = 'rgb(244, 244, 119, 0.9)';
                timeImage = 'images/sunrise.png';
                break;
            case 2:
                //timeOfDay = 'rgb(255, 175, 48, 0.8)';
                timeImage = 'images/daytime.png';
                break;
            default:
                break;
        }

        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId);
        //var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId).css('background-color' , timeOfDay);
        var imageContainer = $(`<img src=${timeImage} />`).addClass('timeOfDayImage')
        //Creates a container with the goal description

        var goalBar = $("<div>").addClass('goal-description').text(goalDescription);

        //Creates drop down menu to mark goal as complete or incomplete
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container');
        
        var icons = $('<i>').addClass('material-icons shadow').text('menu'); 
        var completeButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button').attr('data-activates', 'dropdown'+goalId);
        completeButton.append(icons);

        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+goalId);

        let goalSelector = '#goalId'+goalId;

        var completeItem = $('<li>').addClass('complete center-align').on('click', ()=>{

            updateGoal(goalId,goals);
            $(goalSelector).addClass('animated bounceOutLeft');
            setTimeout((()=>{$(goalSelector).remove()}), 500);
        }).wrapInner('<a href="#!"><i class="material-icons small">check</i>Did it</a>');


        var exitItem = $('<li>').addClass('center-align').wrapInner('<a href="#!"><i class="material-icons small">close</i>Nah</a>');


        dropDownList.append(completeItem, exitItem);

        goalContainer.append(imageContainer);



        dropDownMenuButtonContainer.append(completeButton,dropDownList);

        goalContainer.append(goalBar, dropDownMenuButtonContainer);

        $('.goal-list').append(goalContainer);
        // $('.complete').wrapInner('<a href="#">Complete</a>')
        $('.dropdown-trigger').dropdown();

    }
    // for(var j=1; j<=goals.length; j++){
    //     let initialChildElement = $('.goal-container:nth-child(' +j+')');
    //     let nextChildElement = $('.goal-container:nth-child(' +(j+1)+')');
    //     if(initialChildElement.css('background-color') !== nextChildElement.css('background-color')){
    //         let currentBackgroundColor = initialChildElement.css('background-color');
    //         let nextBackgroundColor = nextChildElement.css('background-color');

    //         initialChildElement.css('background', `linear-gradient(${currentBackgroundColor},${nextBackgroundColor})`);
    //         //nextChildElement.css('background', `linear-gradient(${nextBackgroundColor},${currentBackgroundColor})`);
    //     }
    //     if(nextChildElement.length === 0) {
    //         let currentBackgroundColor = initialChildElement.css('background-color');
    //         initialChildElement.css('background', `linear-gradient(${currentBackgroundColor}, #F2F2F2)`);

    //     }

    // }
}

function updateGoal(goalId, goals) {
    for(var i=0; i<goals.length; i++){
        if(goals[i].goal_id === goalId){
            var goalstat = goals[i].stats;
            goalstat++;
            console.log(goalstat, goalId)
        }
    }
    console.log(goalId);
    console.log("This is the goals" + goals);
    $.ajax({
        type: "POST",
        url: "/goals/update/status",
        data: {
            goal_id: goalId,
            stats: goalstat,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
        }

    })
}


// function reminders(users){
//     let startDate = users[0].startdate;
//     let endDate = users[0].finishdate;

//     let duration = 4;;
//     console.log('startDate', startDate, endDate);

//     if(duration < 7){
//         displayReminder(users[0].goal);
//     }
// }

// function displayReminder(goal){
//     let reminder = $('<div>').addClass('reminder').text(goal);
//     $('.dashboard-container').append(reminder);
// }

// function retrieveServerData(){
//     var apiKey = {api_key: 'uTqhiGEpct'}; //'force-failure': 'timeout'

//     $.ajax({
//             data: apiKey,
//             url: 'http://s-apis.learningfuze.com/sgt/get',
//             method: 'post',
//             dataType: 'json',
//             success: function(response){
//                 $('.student-table-row').remove();
//                 $("#getServerDataButton").button('reset'); 
//                 console.log(response);                       
//                 for(var i=0; i<response.data.length; i++){
//                         student_array.push(response.data[i]);
//                         updateStudentList(student_array);
//                 }

//             }
//     });

//   }