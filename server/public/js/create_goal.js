var goalAndDateArray = [];
// var canBeClicked = true;
var category = '';
var predefinedCategories = [
    {
        class: "diet",
        src: "diet-banner2.jpg",
        alt: "diet"
    },
    {
        class: "fitness",
        src: "banner-fitness2.png",
        alt: "fitness"
    },
    {
        class: "habit",
        src: "habit_2.png",
        alt: "habit"
    },
];



$(document).ready(initializeApp);

function initializeApp() {
    $('select.categorySelect').formSelect();
    // renderPredefinedCategories();
    $("#end_date").attr('min', getTodayDate);
    $(".ideas").on('click', renderPredefinedCategories);
    $('.predefined-goals').on('click', handlePredefinedGoal);
}

function renderPredefinedCategories(){
    var containerDiv = $('.predefined-goals-container');
    var location = "./images/";
    $('.predefined-goals p.hidden').removeClass('hidden').addClass('show');

    for (var i = 0; i < predefinedCategories.length; i++){
        var div = $('<div>', {
            "class": `categoryContainer ${predefinedCategories[i].class}`
        });
        var img = $('<img>', {
            "class": "categoryImg"
        });
        img.attr({src: location+''+predefinedCategories[i].src, alt: predefinedCategories[i].alt});
        div.append(img);
        containerDiv.append(div);
    }
}

function handlePredefinedGoal(){
    category = event.target.alt;
    
    if( category === "fitness"){
        $('.diet, .habit').removeClass('show').addClass('hidden');
        var targetElement = $('.fitness-goals');
        var id = $('#fitness_idea_list');
        getIdeaValue( targetElement, id );
    }
    else if( category === "diet"){

        $('.fitness, .habit').removeClass('show').addClass('hidden');
        var targetElement = $('.diet-goals');
        var id = $('#diet_idea_list');
        getIdeaValue( targetElement, id );
    }
    else if( category === "habit"){

        $('.diet, .fitness').removeClass('show').addClass('hidden');
        var targetElement = $('.habit-goals');
        var id = $('#habit_idea_list');
        getIdeaValue( targetElement, id );
    }

    $(".undo").removeClass('inactiveLink').on('click', () => { handleUndoButtonClicked( category )} );

}

function getIdeaValue( targetElement, id ) {
    var goal = '';

    targetElement.removeClass('hidden').addClass('show');
    id.on('click', 'li', function () {
        goal = $(this).text();
        targetElement.removeClass('show').addClass('hidden');
        console.log('goal:', goal);

        $('.predefined-goals p').addClass('hidden');
        $('.goals_message, .goalInput , .days, .timeOfDay, .endDate').addClass('show');

        //update input goal field with the selected idea
        $('.goalInput').val(goal);
        // updateCanBeClicked( goal )
        $(".add").removeClass('inactiveLink').on('click', () => handleAddButtonClicked( goal ));

    });
}

function handleUndoButtonClicked( category ) {
    console.log("undo btn clicked");
    if ( category === 'fitness'){

        $('.diet, .habit').removeClass('hidden').addClass('show');
        $('.fitness-goals').removeClass('show').addClass('hidden');

        //clear user input and hide elements that was shown
        clearUserInput();
    }
    else if ( category === 'diet'){
        $('.fitness, .habit').removeClass('hidden').addClass('show');
        $('.diet-goals').removeClass('show').addClass('hidden');
        clearUserInput();
        
    }
    else if ( category === 'habit'){
        $('.diet, .fitness').removeClass('hidden').addClass('show');
        $('.habit-goals').removeClass('show').addClass('hidden');
        
        clearUserInput();
    }
}

function handleAddButtonClicked( goal ) {
    console.log('add btn clicked');

    var inputGoalField = validateGoalInputField();
    var dateCheckBox = validateDateCheckBox();
    var timeFrame = validateTimeFrameSelection();
    var finishOn = validateFinishDateSelection();

    //validate user input
    if( inputGoalField === false || dateCheckBox === false || timeFrame === false || finishOn === false){
        return;
    }

    //get user goal
    // var goal = $('.goalInput').val();
    // console.log('new goal: ', goal);

    //get the values of the selected dates and store in an array
    const selectedDate = Array.from($("input[type='checkbox']")).filter( (checkbox) => checkbox.checked).map((checkbox) =>{
        return convertDayIntoNumberFormat(checkbox.value)
    });
    console.log('selectedDate: ', selectedDate);

    //get the value of user selected time frame (morning/afternoon/evening)
    var timeOfDay = $('#timeframe').val()
    console.log('timeOfDay:', timeOfDay);

    //get the end date
    var finishDate = getFinishDate();
    console.log('endDate:', finishDate);

    //loop thru the selectedDate array and create object for each day
    for(var i = 0; i<selectedDate.length; i++){
        var newObject = createObject(goal, selectedDate[i], timeOfDay, finishDate);
        console.log('newObject:', newObject);
        postGoalToServer(newObject);
   //     postGoalToServer('this is the new goal', 1, "2018-04-10", "2018-04-12", "morning");
        // postGoalToServer(selectedDate[i], goal, timeOfDay, finishDate);
        goalAndDateArray.push(newObject);
    }
    // console.log("goalAndDateArray: ", goalAndDateArray)

    clearUserInput();
    // goBackToDashboard();
}

function validateGoalInputField() {
    //if user didn't input their goal then display error message
    if($(".goalInput").val() === ""){
        $(".message").addClass("error").text("Please enter your goal or select one from ideas");
        return false;
    }
    //remove the error message if there was an error before
    else{
        $(".creatingGoal > .message").removeClass('error').text("Name New Goal");
        return true;
    }
}

function validateDateCheckBox() {
    var checkedArray = $("input:checkbox").filter(":checked");
    //if user didn't select any date then display error message
    if(checkedArray.length === 0){
        $(".days > p").addClass("error").text("You must select at least one day!")
        return false;
    }
    //remove the error message if there was an error before
    else{
        $(".days > p").removeClass('error').text("Days to Track Your Goal");
        return true;
    }
}

function validateTimeFrameSelection() {
    //if user didnt select a value then display error message
    if( $('#timeframe').val() === null ){
        $(".timeOfDay > p").addClass("error").text("You must select a time frame");
        return false;
    }
    else{
        $(".timeOfDay > p").removeClass("error").text("I want to do it");
        return true;
    }
}

function validateFinishDateSelection() {
    //if user didnt select a value then display error message
    if( $('#end_date').val() === "" ){
        $(".endDate > p").addClass("error").text("Please select a finish date");
        return false;
    }
    else{
        $(".endDate > p").removeClass("error").text("Select End Date");
        return true;
    }
}

function convertDayIntoNumberFormat( day ) {

    if( day === "sunday"){
        return 0;
    }
    else if( day === "monday"){
        return 1;
    }
    else if( day === "tuesday") {
        return 2;
    }
    else if( day === "wednesday") {
        return 3;
    }
    else if( day === "thursday") {
        return 4;
    }
    else if( day === "friday") {
        return 5;
    }
    else if( day === "saturday") {
        return 6;
    }
}

// function handleIdeaBtnClick() {
//     console.log('idea btn clicked');
//     if(canBeClicked){
//         canBeClicked = false;
//         getIdeaValue();
//     }
//     else {
//         canBeClicked = true;
//         $('.goalIdeas').css('display', 'none');
//     }
// }


// function updateCanBeClicked( goal ) {
//     if( goal !== ''){
//         canBeClicked = true;
//     }
// }

//get today's date for the calendar
function getTodayDate(){
    var date = new Date();
    var dd = leadingZero(date.getDate());
    var mm = leadingZero(date.getMonth()+1);
    var yyyy = date.getFullYear();
    return (yyyy+'-'+mm+'-'+dd);
}

function leadingZero( num ) {
    if( num<10 ){
        return '0'+num;
    }
    else{
        return num;
    }
}

function getFinishDate() {
    
    var ending = $('#end_date').val()
    console.log('end date:', ending);
    var date = new Date(ending);

    var day = leadingZero(date.getUTCDate());
    var month = leadingZero(date.getMonth()+1);
    var year = date.getFullYear();
    return (year+'-'+month+'-'+day);
}

function createObject(goal, day, timeOfDay, endDate) {
    var object = {};
    // object.category = category;
    object.goal = goal;
    object.day = day;
    // object.startdate = getTodayDate();
    object.startdate = "2018-04-10";
    object.finishdate = endDate;
    object.timeframe = timeOfDay;
    return object;
}

function clearUserInput() {
    $('.goals_message, .goalInput , .days, .timeOfDay, .endDate').removeClass('show').addClass('hidden');

    $('.goalInput').val('');
    $('input[type=checkbox]').prop('checked', false);
    $('#timeframe').prop('selectedIndex', 0);
    $('#end_date').val('');
    category = '';
}

function postGoalToServer( object ){
// function postGoalToServer( goal, day, startdate, finishdate, timeframe ){

    console.log('created Object', object);
    $.ajax({
        type: "POST",
        url: "/goals",
        data: {
            goal: object.goal,
            day: object.day,
            startdate: object.startdate,
            finishdate: object.finishdate,
            timeframe: object.timeframe
            // goal: goal,
            // day: day,
            // startdate: startdate,
            // finishdate: finishdate,
            // timeframe: timeframe
        },
        success: function (json_data) {
            var data = json_data;
            console.log('sucsessed sending data:', data);

            //add function to go back to the dashboard
        }
    })
}

// function goBackToDashboard(){
//     history.go(-1);
// }