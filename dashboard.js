$(document).ready(initializeApp);
var goals = [
    {
        goalName:'Sleep eary', 
        freq:'3', 
        endDate:'04/03/18'
    },
    {
        goalName:'Sleep late', 
        freq:'5', 
        endDate:'04/12/18'
    },
    {
        goalName:'Do not sleep', 
        freq:'7', 
        endDate:'04/11/18'
    },
]

function initializeApp(){
    renderTaskOnDashboard(goals);
    applyClickHandlers;
}

function applyClickHandlers(){
    ('.complete').on('click', completeGoal)
}


function renderTaskOnDashboard(goals){
    for(var i=0; i<goals.length;i++){
        var goalDescription = goals[i].goalName;
        var taskContainer = $('<div>').addClass('task-container task'+i);
        var taskBar = $("<div>").addClass('task-description z-depth-3').text(goalDescription)
        
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container z-depth-3')
        var completeButton = $('<button>').addClass('dropdown-button dropdown-trigger task-button material-icons').attr('data-activates', 'dropdown').text('menu')
        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown')
        var completeItem = $('<li>').addClass('complete').on('click', completeGoal)
        
        dropDownList.append(completeItem)



        dropDownMenuButtonContainer.append(completeButton,dropDownList)


        
        taskContainer.append(taskBar, dropDownMenuButtonContainer)

        $('.task-list').append(taskContainer)
        $('.complete').wrapInner('<a href="#">COMPLETE</a>')
        $('.dropdown-trigger').dropdown();
             
    }
}

function completeGoal(){
    console.log('click')
    $('.task1').remove();
}