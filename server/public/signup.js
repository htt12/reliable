$(document).ready(()=> {
    setTimeout(transitionScreen, 1000);
    initializeApp();
});

function transitionScreen(){
    $('.loading').fadeOut(3000);

}

function initializeApp() {
    getEmailInput();
    getUsernameInput();
    getPasswordInput();
}

function getEmailInput() {
    
}

