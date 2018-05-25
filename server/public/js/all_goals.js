$(document).ready(initializeApp);

function initializeApp(){
    getData();
}

/**** Ajax call to fetch data of all goals of appropriate user ****/
function getData(){
    let d = new Date();
    let n = (d.getUTCDate());
    console.log('n',n)
    let day = n;
    $.ajax({
        type: 'GET',
        url: '/goalssql',
        dataType: 'json',
        jsonpCallback: 'callback',
        crossDomain: true,
        cache: false,
        data: {
            day: day
        },
        success: function(resp){
            console.log(resp);
            $('.all-goals-list').empty();

            if(resp.data.length === 0){
                let div = $('<div>', {
                    class: 'message'
                });
                let p = $('<p>', {
                    text: 'You have no goals to display'
                });
                let a = $('<a>', {
                    class: 'btn btn-small z-depth-2',
                    href: 'create_goal.html',
                    text: 'Add Goal'
                });

                div.append(p, a);
                $('.all-goals-list').append(div);
            }
            else{
                rendergoalOnDashboard(resp.data)
            }
            // rendergoalOnDashboard(resp.data)

            $('html, body').animate({
                scrollTop: $('.all-goals-list').offset().top}, 2000)
            
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}



/**** Allows editing and deleting goals both locally & on database ****/
function editGoal(goalSelected, goalId){

    let textToEdit = $(goalSelected).find('.goal-description');
    
    let currentText = $(goalSelected +'> .goal-description').text();

    console.log('currentText', currentText);
    $(goalSelected +'> .goal-description').text('');

    $(`<input class='center' type='text' value='${currentText}'>`).css({
        'margin': '3px',
        'font-size': '2rem',
        'border-bottom': '3px yellow solid',
        'height': '100%',
        'width': '100%',

    }).appendTo(textToEdit).focus();

    
    $('input').on('keypress',  (e)=>{
        if(e.keyCode == 13){
            let edit = $('input').val();
            if(!edit){
                edit = currentText;
            }
            $(goalSelected+'> .goal-description').text(edit);
            $('input').remove();

            $.ajax({
                type: 'POST',
                data: {
                    goal: edit,
                    goal_id: goalId,
                },
                url: '/goals/update',
                // dataType: 'json',

                success: function(resp){
                    getData();
                },
                error: function(xhr, status, err){
                    console.log(err)
                }
            });
        };
    });

    $('input').on('focusout',  (e)=>{
            let edit = $('input').val();
            if(!edit){
                edit = currentText;
            }
            $(goalSelected+'> .goal-description').text(edit);
            $('input').remove();

            $.ajax({
                type: 'POST',
                data: {
                    goal: edit,
                    goal_id: goalId,
                },
                url: '/goals/update',
                // dataType: 'json',

                success: function(resp){
                    getData();
                },
                error: function(xhr, status, err){
                    console.log(err)
                }
            });
    });
}

function deleteGoal(goalId){
    console.log('goalID', goalId);
    $.ajax({
        type: 'POST',
        data: {
            goal_id: goalId,
        },
        url: '/goals/delete',
        // dataType: 'json',
        
        success: function(resp){
            console.log('delete',resp);
            setTimeout(()=>{
                $('.goal-list').empty();
                getData()
            }, 1000);
        },
        error: function(xhr, status, err){
            console.log(err)
        }
    })
}

// ***************** TESTING *************************
// var object = [
//     {
//         goal: 'make it work make it work make it work make it work make it work make it work make it work make it work make it work make it work',
//         goal_id: 88,
//         day: 6,
//         timeframe: 2
//     },
    // {
    //     goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
    //     goal_id: 8,
    //     day: 2,
    //     timeframe: 1
    // },
    // {
    //     goal: 'make it work',
    //     goal_id: 18,
    //     day: 5,
    //     timeframe: 2
    // },
    // {
    //     goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
    //     goal_id: 8,
    //     day: 2,
    //     timeframe: 1
    // },
    // {
    //     goal: 'make it work make it work make it work',
    //     goal_id: 10,
    //     day: 4,
    //     timeframe: 2
    // },
    // {
    //     goal: 'make $$$$$$$$$$$$$$$$$$$$$$$',
    //     goal_id: 8,
    //     day: 5,
    //     timeframe: 2
    // },
    // {
    //     goal: 'make it work make it work make it work',
    //     goal_id: 88,
    //     day: 2,
    //     timeframe: 1
    // }
// ]

// rendergoalOnDashboard(object);

// ***************************************************


function rendergoalOnDashboard(goals){
    console.log('goals',goals)
    var users = []

    if(goals.length !== 0){
        $(".message").addClass('hidden');
    }

    for(var i=0; i<goals.length;i++){
        users.push(goals[i]);
        //Gets goal description
        var goalDescription = goals[i].goal;
        let goalId = goals[i].goal_id;
        let dayName = convertToDayOfWeek(parseInt(goals[i].day));

        //Determines what time of day was selected to display appropriate image/background color

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
        
        //var goalContainer = $('<div>').addClass('goal-container goal valign-wrapper ').attr('id','goalId'+goalId).css('background-color' , timeOfDay);
        
        //Creates a container with the goal description
        var dayNameContainer = $("<div>").addClass('dayName').text(dayName);
        var imageContainer = $(`<img src=${timeImage} />`).addClass('timeOfDayImage')

        var goalBar = $("<div>").addClass('goal-description').text(goalDescription);
        
        //Creates drop down menu to mark goal as edit or delete
        var dropDownMenuButtonContainer = $('<div>').addClass('button-container');
        
        var icons = $('<i>').addClass('material-icons shadow').text('menu'); 
        var editButton = $('<button>').addClass('dropdown-button dropdown-trigger goal-button').attr('data-activates', 'dropdown'+goalId);
        editButton.append(icons);


        var dropDownList = $('<ul>').addClass('dropdown-content').attr('id','dropdown'+goalId);
        
        let goalSelector = '#goalId'+goalId;

        
        var editItem = $('<li>').addClass('edit center-align').on('click', ()=>{ 
            editGoal(goalSelector, goalId)
            }).wrapInner('<a href="#">Edit</a>');
        
        var deleteItem = $('<li>').addClass('delete center').on('click', ()=>{
            $(goalSelector).addClass('animated bounceOutDown');
            deleteGoal(goalId);
       }).wrapInner('<a>Delete</a>')

        
        dropDownList.append(editItem, deleteItem);


        dropDownMenuButtonContainer.append(editButton,dropDownList);
        goalContainer.append(imageContainer);
        goalContainer.append(dayNameContainer);
        
        goalContainer.append(goalBar, dropDownMenuButtonContainer);
        $('.all-goals-list').append(goalContainer);
        

        
        $('.dropdown-trigger').dropdown();
             
    }

    //Transitions background color if proceeeding background color is different: creates gradient

    // for(var j=1; j<goals.length; j++){
    //     let initialChildElement = $('.goal-container:nth-child(' +j+')');
    //     let nextChildElement = $('.goal-container:nth-child(' +(j+1)+')');
    //     if(initialChildElement.css('background-color') !== nextChildElement.css('background-color')){
    //         let currentBackgroundColor = initialChildElement.css('background-color');
    //         let nextBackgroundColor = nextChildElement.css('background-color');
            
    //         initialChildElement.css('background', `linear-gradient(${currentBackgroundColor},${nextBackgroundColor})`);

    //     }
        
    // }
}

function displayDate(){
    let todayDate = getTodayDate();
    console.log('today',todayDate);
    
    $('.date').text(todayDate);
}

function getTodayDate(){
    var date = new Date();
    // var day = date.getDay();
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
        return "TUE";
    }
    else if( day === 3) {
        return "WED";
    }
    else if( day === 4) {
        return "THU";
    }
    else if( day === 5) {
        return "FRI";
    }
    else if( day ===6) {
        return  "SAT";
    }
}
