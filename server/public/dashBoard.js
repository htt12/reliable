
$(document).ready(initializeApp);


var goals = [
    {
        goal_id: '1',
        goalName:'Sleep eary', 
        freq:'3', 
        endDate:'04/03/18'
    },
    {
        goal_id: '2',
        goalName:'Sleep late', 
        freq:'5', 
        endDate:'04/12/18'
    },
    {
        goal_id: '3',
        goalName:'Do not sleep', 
        freq:'7', 
        endDate:'04/11/18'
    },
]

function initializeApp(){
    rendergoalOnDashboard(goals);
    applyClickHandlers;

}

function applyClickHandlers(){
    ('.complete').on('click', completeGoal)
}


function rendergoalOnDashboard(goals){
    for(var i=0; i<goals.length;i++){
        //Gets goal description
        var goalDescription = goals[i].goalName;
        var goalId = goals[i].goal_id
        
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
        }).wrapInner('<a href="#">Complete</a>')
        
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