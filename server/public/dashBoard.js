
$(document).ready(initializeApp);




function initializeApp(){
    getData();
    applyClickHandlers;

}

function getData(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8000/goalssql/:userID',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        success: function(resp){
            console.log(resp);
            
            rendergoalOnDashboard(resp.data)
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

function applyClickHandlers(){
    ('.complete').on('click', completeGoal)
}


function rendergoalOnDashboard(goals){
    console.log('goals',goals)
    var users = []

    for(var i=0; i<5;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].goal;
        var goalId = goals[i].goal_id;
        
        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId);
        
        //Creates a container with the goal description
        var goalBar = $("<div>").addClass('goal-description z-depth-3').text(goalDescription)
        
        //Creates drop down menu to mark goal as complete or incomplete
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container z-depth-3')
        
        var completeButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button material-icons').attr('data-activates', 'dropdown'+goalId).text('menu')
        
        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+goalId)
        
        let goalSelector = '#goalId'+goalId;

        var completeItem = $('<li>').addClass('complete center-align').on('click', ()=>{
            $(goalSelector).remove();
        }).wrapInner('<a href="#">:)</a>')
        
        var inCompleteItem = $('<li>').addClass('incomplete center').on('click', ()=>{
            $(goalSelector).remove();
        }).wrapInner('<a> :(</a>')

        
        dropDownList.append(completeItem, inCompleteItem)


        dropDownMenuButtonContainer.append(completeButton,dropDownList)
        
        goalContainer.append(goalBar, dropDownMenuButtonContainer)

        $('.goal-list').append(goalContainer)
        // $('.complete').wrapInner('<a href="#">Complete</a>')
        $('.dropdown-trigger').dropdown();
             
    }
    

    reminders(users);
}


function reminders(users){
    let startDate = users[0].startdate;
    let endDate = users[0].finishdate;

    let duration = 4;;
    console.log('startDate', startDate, endDate);

    if(duration < 7){
        displayReminder(users[0].goal);
    }
}

function displayReminder(goal){
    let reminder = $('<div>').addClass('reminder').text(goal);
    $('.dashboard-container').append(reminder);
}

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