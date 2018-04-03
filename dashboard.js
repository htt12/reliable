$(document).ready(initializeApp);

function initializeApp(){
    applyClickHandlers;
};

function applyClickHandlers(){
    $('.dropdown-trigger').dropdown();
    $('.fixed-action-btn').floatingActionButton('direction', 'left');
}