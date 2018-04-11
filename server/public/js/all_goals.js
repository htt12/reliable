
$(document).ready(initializeApp);




function initializeApp(){
    let userId = req.session.userId;
    console.log(userId);
    getData(userId);
    

}
function getData(userId){
    $.ajax({
        type: 'GET',
        url: 'http://reliable.keatonkrieger.com/goalssql/'+userId,
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



function editGoal(goalSelected){

    let textToEdit = $(goalSelected).find('.goal-description');

    $(goalSelected +'> .goal-description').text('');

    $("<input class='center' type='text'>").css({
        'margin': 0,
        'border-radius': '25px',
        'height': '100%',
        'width': '100%',
        
    }).appendTo(textToEdit).focus();
    
    $('input').on('focusout', ()=>{
        
        let edit = $('input').val();

        $(goalSelected+'> .goal-description').text(edit);

        console.log(edit)
        $('input').remove();
    })
}


function rendergoalOnDashboard(goals){
    console.log('goals',goals)
    var users = []

    for(var i=0; i<goals.length;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].goal;
        var goalId = goals[i].goal_id;
        
        //Creates goal container for each goal
        var goalContainer = $('<div>').addClass('goal-container goal').attr('id','goalId'+goalId);
        
        //Creates a container with the goal description
        var goalBar = $("<div>").addClass('goal-description z-depth-3').text(goalDescription)
        
        //Creates drop down menu to mark goal as edit or delete
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container z-depth-3')
        
        var editButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button material-icons').attr('data-activates', 'dropdown'+goalId).text('menu')
        
        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+goalId)
        
        let goalSelector = '#goalId'+goalId;

        
        var editItem = $('<li>').addClass('edit center-align').on('click', ()=>{
            
            editGoal(goalSelector)
            }
        ).wrapInner('<a href="#">Edit</a>')
        
        var deleteItem = $('<li>').addClass('delete center').on('click', ()=>{
            $(goalSelector).remove();
        }).wrapInner('<a>Delete</a>')

        
        dropDownList.append(editItem, deleteItem)


        dropDownMenuButtonContainer.append(editButton,dropDownList)
        
        goalContainer.append(goalBar, dropDownMenuButtonContainer)

        $('.all-goals-list').append(goalContainer)
        // $('.edit').wrapInner('<a href="#">edit</a>')
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