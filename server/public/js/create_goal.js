var goalAndDateArray = [];
var category = '';
var pageCount = 0;
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
    $('.goalInput').focusout(handleManualGoalInput);
    $('.categoryDropdown').on('click', handleCategoryDropdownClicked);
    $(".ideas").on('click', handleIdeaBtnClick);
    $('.predefined-goals').on('click', handlePredefinedGoalClicked);
    $('.add.next').on('click', handleNextPageButtonClicked);

    $("#end_date").attr('min', getTodayDate);
}

function handleManualGoalInput(){
    // console.log('handle goal input');
    //get user goal
    var goal = $('.goalInput').val();
    console.log('new goal: ', goal);
    validateGoalInputField();
}

function handleCategoryDropdownClicked(){
     
    // console.log("category called");
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
    
    $('.categoryDropdown').focusout(function () {
        $(this).removeClass('active');
        $(this).find('.dropdown-menu').slideUp(300);
    });

    //get category value
    $('.categoryDropdown .dropdown-menu li').click(function () {
        $('.categoryDropdown').find('span').text($(this).text());
        // $(this).parents('.categoryDropdown').find('span').text($(this).text());
        category = $(this).text();
    });
    console.log('category:', category);
}

function handleIdeaBtnClick() {
    console.log('idea btn clicked');
    $(".undo").removeClass('inactiveLink');
    $('.creatingGoal, .categoryContainer, .horizontalLine').addClass('hidden');
    $('.predefined-goals').removeClass('hidden').addClass('show');
    renderPredefinedCategories();
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

function handlePredefinedGoalClicked(){
    category = event.target.alt;
    
    if( category === "fitness"){
        $('.diet, .habit').removeClass('show').addClass('hidden');
        var targetElement = $('.fitness-goals');
        var id = $('#fitness_idea_list');
        getPredefinedGoalValue( targetElement, id );
        //update category dropdown
        updateGoalCategoryOnDropdown('Fitness');
    }
    else if( category === "diet"){

        $('.fitness, .habit').removeClass('show').addClass('hidden');
        var targetElement = $('.diet-goals');
        var id = $('#diet_idea_list');
        getPredefinedGoalValue( targetElement, id );
        updateGoalCategoryOnDropdown('Diet');

    }
    else if( category === "habit"){

        $('.diet, .fitness').removeClass('show').addClass('hidden');
        var targetElement = $('.habit-goals');
        var id = $('#habit_idea_list');
        getPredefinedGoalValue( targetElement, id );
        updateGoalCategoryOnDropdown('Habit');

    }
    // $(".undo").removeClass('inactiveLink').on('click', () => { handleUndoButtonClicked( category )} );

}

function getPredefinedGoalValue( targetElement, id ) {
    var goal = '';

    targetElement.removeClass('hidden').addClass('show');
    id.on('click', 'li', function () {
        goal = $(this).text();
        targetElement.removeClass('show').addClass('hidden');
        console.log('goal:', goal);

        $('.predefined-goals').removeClass('show').addClass('hidden');
        $('.creatingGoal, .categoryContainer').removeClass('hidden').addClass('show');
        //update input goal field with the selected idea
        $('.goalInput').val(goal);

    });
}

function updateGoalCategoryOnDropdown( category ){
    $('.categoryDropdown').find('span').text(category);
}

function handleNextPageButtonClicked(){
    console.log('pageCount:', pageCount);
    // $('.goals_message, .goalInput , .timeOfDay').addClass('show');

    // var timeFrame = validateTimeFrameSelection();
    // var finishOn = validateFinishDateSelection();

    //validate user input
    // if(dateCheckBox === false || timeFrame === false || finishOn === false){
    //     return;
    // }




    //check which page the user is on
    if(pageCount === 0){
        var inputGoalField = validateGoalInputField();

        if( inputGoalField === false ){
            $('.add.next').addClass('inactiveLink');
            return;
        } 
        pageCount++;
        $('.add.next').removeClass('inactiveLink');
        $('.days').removeClass('hidden').addClass('show');
    }
    else if(pageCount === 1){
        var dateCheckBox = validateDateCheckBox();
        if(dateCheckBox === false ){
            return;
        }
        $('.endDate').removeClass('hidden').addClass('show');
    }
    else if(pageCount === 2){
        //send data to the server
    }
    
}

// function handleUndoButtonClicked( category ) {
//     console.log("undo btn clicked");
//     if ( category === 'fitness'){

//         $('.diet, .habit').removeClass('hidden').addClass('show');
//         $('.fitness-goals').removeClass('show').addClass('hidden');

//         //clear user input and hide elements that was shown
//         clearUserInput();
//     }
//     else if ( category === 'diet'){
//         $('.fitness, .habit').removeClass('hidden').addClass('show');
//         $('.diet-goals').removeClass('show').addClass('hidden');
//         clearUserInput();
        
//     }
//     else if ( category === 'habit'){
//         $('.diet, .fitness').removeClass('hidden').addClass('show');
//         $('.habit-goals').removeClass('show').addClass('hidden');
        
//         clearUserInput();
//     }
// }

function handleSubmitButtonClicked() {
    console.log('add btn clicked');


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
        $(".creatingGoal > .message").addClass("error").text("Please Enter Your Goal or Pick from Ideas");
        return false;
    }
    //remove the error message if there was an error before
    else{
        $(".creatingGoal > .message").removeClass('error').text("Name Your Goal");
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
    
    var ending = $('#end_date').val();
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
    object.status = "active";
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
            timeframe: object.timeframe,
            status: object.status,
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