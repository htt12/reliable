
$(document).ready(initializeApp);


/***************************************************************************************************
* initializeApp  
* @params {undefined} none
* @returns: {undefined} none
*
* Initializes application. Retrieves data for logged in user for current day.
* Displays date on title bar.
*/
function initializeApp(){
    getData();
    displayDate();
}
/***************************************************************************************************
* displayDate  
* @params {undefined} none
* @returns: {undefined} none
*
* Displays date on title bar.
*/
function displayDate(){
    let todayDate = getTodayDate();
    $('.date').text(todayDate);
}

/***************************************************************************************************
* getTodayDate  
* @params {undefined} none
* @returns: {today's date}
*
* Calculates today's date in preferred format of i.e, MON 05/21
*/
function getTodayDate(){
    var date = new Date();
    var day = date.getDay();
    var dd = leadingZero(date.getDate());
    var mm = leadingZero(date.getMonth()+1);
    let dayOfWeek = convertToDayOfWeek(day);
    // var yyyy = date.getFullYear();
    return (dayOfWeek+ '  ' +mm+'/'+dd);
}

/***************************************************************************************************
* leadingZero  
* @params {undefined} none
* @returns: {number}
*
* Conditional to determine if a 0 is needed to be added to certain dates
*/
function leadingZero( num ) {
    if( num<10 ){
        return '0'+num;
    }
    else{
        return num;
    }
}

/***************************************************************************************************
* convertToDayOfWeek  
* @params {day} 
* @returns: {string (day of week)} 
*
* Converts determined day of week to corresponding name of day.
*/
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

/***************************************************************************************************
* getData  
* @params {undefined} none
* @returns: {undefined} none
*
* Retrieves goals with corresponding day and user ID, and renders on dashboard.
* If no goals are retrieved, a message to add goals will display.
*/
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
            console.log('server resp:',resp);
            console.log('server data:', resp.data.length);
            if(resp.data.length === 0){
                $(".message").removeClass('hidden');
            }
            else{
                renderGoalOnDashboard(resp.data)
            }
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

/***************************************************************************************************
* renderGoalOnDashboard  
* @params {string} goals retrieved
* @returns: {undefined} none
*
* Renders goals on dashboard
*/
function renderGoalOnDashboard(goals){
    var users = [];

    for(var i=0; i<goals.length;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].goal;
        let goalId = goals[i].goal_id;
        //let timeOfDay = 'rgb(15, 65, 119, 0.6)';
        let timeImage = 'images/moon.png';
        let timeImagePosition = 'moon';
        switch (parseInt(goals[i].timeframe)){
            case 1:
                //timeOfDay = 'rgb(244, 244, 119, 0.9)';
                timeImage = 'images/sunrise.png';
                timeImagePosition = 'sunrise'
                break;
            case 2:
                //timeOfDay = 'rgb(255, 175, 48, 0.8)';
                timeImage = 'images/daytime.png';
                timeImagePosition = 'sun'
                break;
            default:
                break;
        }

        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId);
        //var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId).css('background-color' , timeOfDay);
        var imageContainer = $(`<img src=${timeImage} />`).addClass('timeOfDayImage '+ `${timeImagePosition}`)
        
        //Creates a container with the goal description
        var goalBar = $("<div>").addClass('goal-description').text(goalDescription);

        //Creates drop down container to mark goal as complete or incomplete
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container');
        var icons = $('<i>').addClass('material-icons shadow').text('menu'); 
        
        //Button for dropdown menu and checkmark (completed) and x (did not complete)
        var completeButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button').attr('data-activates', 'dropdown'+goalId);
        completeButton.append(icons);

        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+goalId);
        let goalSelector = '#goalId'+goalId;
        var completeItem = $('<li>').addClass('complete center-align').on('click', ()=>{
            completeGoal(goalId,goals);
            $(goalSelector).addClass('animated bounceOutLeft');
            setTimeout((()=>{$(goalSelector).remove()}), 500);
                }).wrapInner('<a href="#!"><i class="material-icons small">check</i></a>');

        var exitItem = $('<li>').addClass('center-align').on('click', ()=>{
            incompleteGoal(goalId,goals);
            $(goalSelector).addClass('animated bounceOutLeft');
            setTimeout((()=>{$(goalSelector).remove()}), 500);
        }).wrapInner('<a href="#!"><i class="material-icons small">close</i></a>');

        dropDownList.append(completeItem, exitItem);
        goalContainer.append(imageContainer);
        dropDownMenuButtonContainer.append(completeButton,dropDownList);
        goalContainer.append(goalBar, dropDownMenuButtonContainer);
        $('.goal-list').append(goalContainer);
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

/***************************************************************************************************

*/
function completeGoal(goalId, goals) {
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
        }
    });
};

function incompleteGoal(goalId, goals) {
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
        }
    });
};