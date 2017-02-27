/**
 * Created by ikrysteq on 07.01.2017.
 * /Home panel socket
 */

/**
 * Data i czas
 */
var seconds;
var minutes;
var hours;
var day;
var month;
var day_of_week;
var year;
var ticktock = ':';

function timeUpdate() {
    var now = new Date();
    seconds = now.getUTCSeconds();
    minutes = now.getUTCMinutes();
    hours = now.getUTCHours()+1;
    day = now.getUTCDate();
    month = now.getUTCMonth()+1;
    year = now.getUTCFullYear();
    if(ticktock == ':') {
        ticktock = ' ';
    } else {
        ticktock = ':';
    }

    if(seconds.toString().length == 1) {
        seconds = '0' + seconds.toString();
    }
    if(minutes.toString().length == 1) {
        minutes = '0' + minutes;
    }
    if(hours.toString().length == 1) {
        hours = '0' + hours.toString();
    }
    switch (now.getUTCDay()) {
        case 0:
            day_of_week = "Niedziela";
            break;
        case 1:
            day_of_week = "Poniedziałek";
            break;
        case 2:
            day_of_week= "Wtorek";
            break;
        case 3:
            day_of_week = "Środa";
            break;
        case 4:
            day_of_week = "Czwartek";
            break;
        case 5:
            day_of_week = "Piątek";
            break;
        case 6:
            day_of_week = "Sobota";
    }
    var time = hours + ticktock + minutes + ticktock + seconds;
    var date = day_of_week + ', ' +day + '.' + month+ '.' + year;
    $("h3#labelTime").text(time);
    $("#date").text(date);

    setTimeout(timeUpdate, 1000);
}
timeUpdate();



