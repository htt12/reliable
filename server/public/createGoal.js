var goalAndDateArray = [];
var canBeClicked = true;

$(document).ready(initializeApp);

function initializeApp() {
    debugger;
    $("#end_date").attr('min', getTodayDate);
    $(".add").on('click', handleAddButtonClicked);
    $(".cancel").on('click', handleCancelButtonClicked);
    $(".ideas").on('click', handleIdeaBtnClick);
}

function postGoalToServer(goal, day, start, finish, timeframe) {
    $.ajax({
        type: "POST",
        url: "http://reliable.keatonkrieger.com/goals",
        data: {
            goal: goal,
            day: day,
            startdate: start,
            finishdate: finish,
            timeframe: timeframe
        },
        success: function (json_data) {
            var data = json_data;
            console.log(data);
        }
    })
}


function handleAddButtonClicked() {
    console.log('add btn clicked');

    // debugger;
    var inputGoalField = validateGoalInputField();
    var dateCheckBox = validateDateCheckBox();
    var timeFrame = validateTimeFrameSelection();
    var finishOn = validateFinishDateSelection();

    //validate user input
    if( inputGoalField === false || dateCheckBox === false || timeFrame === false || finishOn === false){
        return;
    }

    //get user goal
    var goal = $('.goalInput').val();
    console.log('new goal: ', goal);

    //get the values of the selected dates and store in an array
    const selectedDate = Array.from($("input[type='checkbox']")).filter( (checkbox) => checkbox.checked).map ((checkbox) => checkbox.value);
    console.log('selectedDate: ', selectedDate);

    //get the value of user selected time frame (morning/afternoon/evening)
    var timeOfDay = $('#timeframe').val()
    console.log('timeOfDay:', timeOfDay);

    //get the end date
    var finishDate = getFinishDate();
    console.log('endDate:', endDate);

    //loop thru the selectedDate array and create object for each day
    for(var i = 0; i<selectedDate.length; i++){
        var newObject = createObject(selectedDate[i], goal, timeOfDay, finishDate);
        goalAndDateArray.push(newObject);
    }
    console.log("goalAndDateArray: ", goalAndDateArray)

    clearUserInput();
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

function handleCancelButtonClicked() {
    console.log("cancel btn clicked");
}

function groupGoalByDate() {
    var date = new Date();
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var today = days[date.getDay()];
    return today;
}

function handleIdeaBtnClick() {
    console.log('idea btn clicked');

    if(canBeClicked){
        canBeClicked = false;
        getIdeaValue();
    }
    else {
        canBeClicked = true;
        $('.goalIdeas').css('display', 'none');
    }
}

function getIdeaValue() {
    var goal = '';

    $('.goalIdeas').css('display', 'block');
    $("#idea_list").on('click', 'li', function () {
        goal = $(this).text();
        $('.goalIdeas').css('display', 'none');
        console.log('goal:', goal);

        //update input goal field with the selected idea
        $('.goalInput').val(goal);
    });
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
    var date = new Date($('#end_date').val());
    var day = leadingZero(date.getDate());
    var month = leadingZero(date.getMonth()+1);
    var year = date.getFullYear();
    return (year+'-'+month+'-'+day);
}

function createObject(day, goal, timeOfDay, endDate) {
    var object = {};
    object.goal = goal;
    object.day = day;
    object.startDate = getTodayDate();
    object.finishDate = endDate;
    object.timeFrame = timeOfDay;
    return object;
}

function clearUserInput() {
    $('.goalInput').val('');
    $('input[type=checkbox]').prop('checked', false);
    $('#timeframe').prop('selectedIndex', 0);
    $('#end_date').val('');
}

