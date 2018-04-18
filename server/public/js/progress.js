$(document).ready(move)
    


function move() {
    let timesCompleted = 3;
    let totalNumberOfDays = 10;
    
    let percentageCompleted = (timesCompleted/totalNumberOfDays)*100;
    
        var elem = $('.progress-transition');

        var width = 0;

        var id = setInterval(increasePercentage, 50);
        

    
    function increasePercentage() {
        if (width === percentageCompleted) {
            clearInterval(id);
        } else {
            width++; 
            elem.css('width', width+'%')
            elem.text(width +'%');
        }
    }   
}   