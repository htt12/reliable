var goalAndDateArray = [];

$(document).ready(initializeApp);

function initializeApp() {

    $("#end_date").attr('min', date);
    $(".add").on('click', handleAddButtonClicked);
    $(".cancel").on('click', handleCancelButtonClicked);
    $(".ideas").on('click', handleIdeaBtnClick);
    
}

function handleAddButtonClicked() {
    console.log('add btn clicked');

    // debugger;
    var inputField = validateInputField();
    var checkBox = validateCheckBox();

    //validate user input
    if( inputField === false || checkBox === false ){
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
    var endDate = getEndDate();
    console.log('endDate:', endDate);

    //loop thru the selectedDate array and create object for each day
    for(var i = 0; i<selectedDate.length; i++){
        var newObject = createObject(selectedDate[i], goal, timeOfDay, endDate);
        goalAndDateArray.push(newObject);
    }
    console.log("goalAndDateArray: ", goalAndDateArray)

    // clearUserInput();
}

function validateInputField() {
    //if user didn't input their goal then display error message
    if($(".goalInput").val() === ""){
        $(".message").addClass("error").text("Please enter your goal or select one from ideas");
        return false;
    }
    //remove the error message if there was an error before
    else{
        $(".creatingGoal > .message").removeClass('error').text("Name your new goal:");
        return true;
    }
}

function validateCheckBox() {
    var checkedArray = $("input:checkbox").filter(":checked");
    //if user didn't select any date then display error message
    if(checkedArray.length === 0){
        $(".days > p").addClass("error").text("You must select at least one day!")
        return false;
    }
    //remove the error message if there was an error before
    else{
        $(".days > p").removeClass('error').text("Days to track your goal:");
        return true;
    }
}

function handleCancelButtonClicked() {
    console.log("cancel btn clicked");
}

function clearUserInput() {
    $('.goalInput').val('');
    // $(".creatingGoal > .message").text("Name your new goal:");
    // $(".days > p").text("Days to track your goal:").removeClass('error');
    $('input[type=checkbox]').prop('checked', false);
}

function createObject(day, goal, timeOfDay, endDate) {
    var object = {};
    object.day = day;
    object.goal = goal;
    object.startDate = new Date();
    object.timeOfDay = timeOfDay || '';
    object.endDate = endDate || '';
    return object;
}

function groupGoalByDate() {
    var date = new Date();
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var today = days[date.getDay()];
    // console.log('today: ', today);
    return today;
}

function handleIdeaBtnClick() {
    console.log('idea btn clicked');
    var goal = '';

    $('.goalIdeas').css('display', 'block');
    $("#idea_list").on('click', 'li', function () {
        // console.log('li text: ', $(this).text());
        goal = $(this).text();
        $('.goalIdeas').css('display', 'none');
        console.log('goal:', goal);

        //update input goal field with the selected idea
        $('.goalInput').val(goal);

    });
}

function date(){
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

function getEndDate() {
    var date = new Date($('#end_date').val() );
    var day = leadingZero(date.getDate());
    var month = leadingZero(date.getMonth()+1);
    var year = date.getFullYear();
    return (month+'-'+day+'-'+year);
}

