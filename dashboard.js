$(document).ready(initializeApp);

function initializeApp(){
    applyClickHandlers;
};

function applyClickHandlers(){
    $('.dropdown-trigger').dropdown();
    $('.fixed-action-btn').floatingActionButton('direction', 'left');
    $('.dropdown-button').click(completeGoal);
}

function completeGoal(){
    $('.task-container').remove();
}