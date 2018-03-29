var goalAndDateArray = [];

$(document).ready(initializeApp);

function initializeApp() {
    $(".add").on('click', handleAddButtonClicked);
    $(".cancel").on('click', handleCancelButtonClicked);
    $(".ideas").on('click', displayIdeas);
    
}

function handleAddButtonClicked() {
    // debugger;
    var inputField = validateInputField();
    var checkBox = validateCheckBox();

    if( inputField === false || checkBox === false ){
        return;
    }

    console.log('add btn clicked');
    var goal = $('.goalInput').val();
    console.log('new goal: ', goal);

    const values = Array.from($("input[type='checkbox']")).filter( (checkbox) => checkbox.checked).map ((checkbox) => checkbox.value);
    console.log('values: ', values);
    for(var i = 0; i<values.length; i++){
        var newObject = createObject(values[i], goal);
        goalAndDateArray.push(newObject);
    }
    console.log("goalAndDateArray: ", goalAndDateArray)

    var timeOfDate =
    clearUserInput();
}

function validateInputField() {
    if($(".goalInput").val() === ""){
        $(".message").addClass("error").text("Please enter your goal or select one from ideas");
        return false;
    }
    else{
        $(".creatingGoal > .message").removeClass('error').text("Name your new goal:");
        return true;
    }
}

function validateCheckBox() {
    var checkedArray = $("input:checkbox").filter(":checked");
    // console.log('checkedArray: ', checkedArray);
    if(checkedArray.length === 0){
        $(".days > p").addClass("error").text("You must select at least one day!")
        return false;
    }
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
    $(".creatingGoal > .message").text("Name your new goal:").removeClass('error');
    $(".days > p").text("Days to track your goal:").removeClass('error');
    $('input[type=checkbox]').prop('checked', false);
}

function createObject(day, value) {
    var object = {};
    object.day = day;
    object.goal = value;
    object.time = new Date();
    return object;
}

function groupGoalByDate() {
    var date = new Date();
    var days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var today = days[date.getDay()];
    // console.log('today: ', today);
    return today;
}

function displayIdeas() {

}