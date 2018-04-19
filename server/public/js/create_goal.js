var goalAndDateArray = [];
var category = '';
var goal = '';
var pageCount = 0;
var daysAndTime = [];
var finishDate = null;
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
    $('.categoryDropdown').on('click', handleCategoryDropdownClicked);
    $(".ideas").on('click', handleIdeaBtnClick);
    $('.predefined-goals').on('click', handlePredefinedGoalClicked);
    $('.add.next').on('click', handleNextPageButtonClicked);
    $('.row input').on('click', handleDayandTimeClicked);

    $("#end_date").attr('min', getTodayDate);
}


function handleCategoryDropdownClicked(){
     
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
    
    $('.categoryDropdown').focusout(function () {
        $(this).removeClass('active');
        $(this).find('.dropdown-menu').slideUp(300);
    });

    //get category value
    $('.categoryDropdown .dropdown-menu li').click(function () {
        $('.categoryDropdown').find('span').text($(this).text()).css('color','black');
        category = $(this).text();
    });
    console.log('category:', category);
}

function handleIdeaBtnClick() {
    $(".undo").removeClass('inactiveLink');
    $('.creatingGoal, .categoryContainer, .horizontalLine').addClass('hidden');
    $('.predefined-goals').removeClass('hidden').addClass('show');
    renderPredefinedCategories();
}


function renderPredefinedCategories(){
    var containerDiv = $('.predefined-goals-container');
    var location = "./images/";
    $('.predefined-goals p').removeClass('hidden').addClass('show');

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
}

function getPredefinedGoalValue( targetElement, id ) {

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
    $('.categoryDropdown').find('span').text(category).css('color', 'black');
}

function handleNextPageButtonClicked(){
    console.log('pageCount:', pageCount);

    //check which page the user is on
    if(pageCount === 0){
        var inputGoalField = validateGoalInputField();
        var categorySelection = validateCategoryDropdown();

        if( !inputGoalField || !categorySelection ){
            return;
        }

        pageCount++;
        $('.add.next').removeClass('inactiveLink');
        // debugger;
        $('.creatingGoal, .categoryContainer, .horizontalLine').removeClass('show').addClass('hidden');
        $('.days, .timeOfDay').removeClass('hidden').addClass('show');
        $('.steps .one').css('background-color', 'rgba(162, 211, 218, 0.5)');
        $('.steps .two').css('background-color', 'rgb(242, 197, 118)');
    }
    else if(pageCount === 1){
        $('.steps .two').css('background-color', 'rgba(162, 211, 218, 0.5)');
        $('.steps .three').css('background-color', 'rgb(242, 197, 118)');

        var dateCheckBox = validateDateCheckBox();
        if( !dateCheckBox ){
            return;
        }
        pageCount++;

        $('.days, .timeOfDay').addClass('hidden').removeClass('show');
        $('.endDate').removeClass('hidden').addClass('show');
    }
    else if(pageCount === 2){
        $('.steps .three').css('background-color', 'rgba(162, 211, 218, 0.5)');

      var finishOn = validateFinishDateSelection();

        //validate user input
        if(!finishOn){
            return;
        }
        $('.successMsg').removeClass('hidden').addClass('show');

        //send data to the server
        handleSubmitButtonClicked();
    }
}

function handleSubmitButtonClicked() {
    console.log('add btn clicked');

    //loop thru the selectedDate array and create object for each day
    for(var i = 0; i<daysAndTime.length; i++){
        var day = daysAndTime[i][0];
        var time = daysAndTime[i][1];

        var newObject = createObject(goal, day, category, time, finishDate);
        // console.log('newObject:', newObject);
        postGoalToServer(newObject);
        goalAndDateArray.push(newObject);
    }
    console.log("goalAndDateArray: ", goalAndDateArray)

    clearUserInput();
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
        goal = $('.goalInput').val();
        return true;
    }
}

function validateCategoryDropdown(){
    if(!$('.categorySelect > span').text() || $('.categorySelect > span').text()==="Goal Categories"){
        $(".categoryContainer > .message").addClass("error").text("Please Pick a Category");
        return false;
    }
    $(".categoryContainer > .message").removeClass('error').text("Pick a Category for Your Goal");
    return true;
}

function validateDateCheckBox() {
    var result = true;
    daysAndTime = [];

    var checkedArray = $("input:checkbox").filter(":checked");
    //if user didn't select any date then display error message
    if(checkedArray.length === 0){
        $(".days > p").addClass("error").text("You Must Select the Day and Time")
        return false;
    }
    //remove the error message if there was an error before
    else{
        $(".days > p").removeClass('error').text("Day and Time to Track Your Goal");
        //get the values of the selected dates and store in an array
        Array.from($("input[type='checkbox']")).filter((checkbox) => checkbox.checked).map((checkbox) =>{

            console.log('checkbox value:', checkbox.value)
            var time = getSelectedTimeFrameValue(checkbox.value);
            if(time === null){
                $(".days > p").addClass("error").text("You Must Select the Day and Time")
                result = false;
            }
            else{
                daysAndTime.push([convertDayIntoNumberFormat(checkbox.value), time]);
                console.log('array: ', daysAndTime);
                result = true;
            }
        });
    }
    return result;
}

function removeInactiveLink( day ){
    var selectedDate = `.${day}`;
    $(selectedDate).removeClass('inactiveLink');
}

function handleDayandTimeClicked(){
    if( event.target.value === "sunday"){
        removeInactiveLink( event.target.value );
    }
    else if( event.target.value === "monday"){
        removeInactiveLink( event.target.value );
    }
    else if( event.target.value === "tuesday") {
        removeInactiveLink( event.target.value );
    }
    else if( event.target.value === "wednesday") {
        removeInactiveLink( event.target.value );
    }
    else if( event.target.value === "thursday") {
        removeInactiveLink( event.target.value );
    }
    else if( event.target.value === "friday") {
        removeInactiveLink( event.target.value );
    }
    else if( event.target.value === "saturday") {
        removeInactiveLink( event.target.value );
    }
}

function getSelectedTimeFrameValue( day ) {
    if( day === "sunday"){
        return convertTimeFrameIntoNum($('#sundayTime').val());
    }
    else if( day === "monday"){
        return convertTimeFrameIntoNum($('#mondayTime').val());
    }
    else if( day === "tuesday") {
        return convertTimeFrameIntoNum($('#tuesdayTime').val());
    }
    else if( day === "wednesday") {
        return convertTimeFrameIntoNum($('#wednesdayTime').val());
    }
    else if( day === "thursday") {
        return convertTimeFrameIntoNum($('#thursdayTime').val());
    }
    else if( day === "friday") {
        return convertTimeFrameIntoNum($('#fridayTime').val());
    }
    else if( day === "saturday") {
        return convertTimeFrameIntoNum($('#saturdayTime').val());
    }
}

function convertTimeFrameIntoNum( time ) {

    if( time === "morning"){
        return 1;
    }
    else if( time === "afternoon"){
        return 2;
    }
    else if( time === "evening") {
        return 3;
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
        //get the end date
        finishDate = getFinishDate();
        console.log('endDate:', finishDate);
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
    var date = new Date(ending);

    var day = leadingZero(date.getUTCDate());
    var month = leadingZero(date.getMonth()+1);
    var year = date.getFullYear();
    return (year+'-'+month+'-'+day);
}

function createObject(goal, day, category, time, finishdate) {
    var object = {};
    object.goal = goal;
    object.day = day;
    object.startdate = getTodayDate();
    object.category = category;
    object.finishdate = finishdate;
    object.timeframe = time;

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

    console.log('created Object', object);
    $.ajax({
        type: "POST",
        url: "/goals",
        data: {
            goal: object.goal,
            category: object.category,
            day: object.day,
            startdate: object.startdate,
            finishdate: object.finishdate,
            timeframe: object.timeframe,
            status: object.status,
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
            if (json_data.success) {
                $('.successMsg').addClass('hidden').removeClass('show');
                setTimeout(()=>{(window.location.replace('/dashboard'))}, 2000);
            }
        }
        
    });
}
