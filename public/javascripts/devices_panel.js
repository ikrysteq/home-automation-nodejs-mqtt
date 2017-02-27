/**
 * Socket.io client
 */

//$(document).ready(function() {
//});

var socket = io.connect();
socket.on('mqtt', function (data) {
    console.log(data);
    var device_id = data.deviceID;
    var device_type = data.deviceType;
    var device_data = data.message;
    if(device_type === 'Alarm')
    {
        var alarm = (device_data === 'true');
        if(alarm) {    //gdy wykryto alarm
            $("#data_" + device_id).html('<h2 class="panel-center"><i class="glyphicon glyphicon-warning-sign icon-alert"></i> ALARM!!</h2>');
        } else {
            $("#data_" + device_id).html('<h2 class="panel-center">Czuwanie...</h2>');
        }
    }
    if(device_type === 'Moduł pomiaru energii')
    {
        $("#data_" + device_id).html('<h2 class="panel-center">' + device_data + ' W</h2>');
    }
    // if(device_type === 'Przełącznik') {
    //     if (device_data === 'true') {
    //         $("#data_" + device_id).html('<h3><span class="label lb-lg label-success">ON</span>&nbsp;&nbsp;&nbsp;<a id="" type="submit" role="button" class="btn btn-sm btn-info">Wyłącz</a></h3>');
    //     } else if (device_data === 'false'){
    //         $("#data_" + device_id).html('<h3><span class="label label-danger">OFF</span>&nbsp;&nbsp;&nbsp;<a id="g" type="submit" role="button" class="btn btn-sm btn-primary">Załącz</a></h3>');
    //
    //     }
    // }
    if(device_type === 'Czujnik temperatury i wilgotności')
    {
        var dane = device_data.split('_');
        var temp = dane[0];
        var hum = dane[1];
        $("#data_" + device_id).html('<h2 class="panel-center"><i class="fa fa-thermometer-half" aria-hidden="true"></i>&nbsp;'
            + temp + '&deg;C<br><i class="fa fa-tint"></i>&nbsp;' + hum + '%</h2>');
    }
    if(device_type === 'Termostat')
    {

    }
    if(device_type === 'Czujnik natężenia światła')
    {
        $("#data_" + device_id).html('<h2 class="panel-center">' + device_data + '%</h2>');
    }
   // $("#mqtt").html(data.deviceID + '&deg;C');
});


$(document).ready(function() {
    // włącz przycisk
    $('.btn-primary').click(function (event) {
        var index = $(this).attr('id').split('_');  // #switch_id
        var id = index[1];
        var room = index[2];
        event.preventDefault();
        var data = {};
        //console.log(id);
        data.id = id;
        data.room = room;
        //console.log(local_id);
        data.message = "true";

        //wyślij dane na serwer
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/home/devices/:switch',
            success: function (data) {
                console.log('success');
                window.location.reload();
                //console.log(JSON.stringify(data));
            }
        });
    });

    // wyłącz przycisk
    $('.btn-info').click(function (event) {
        var index = $(this).attr('id').split('_');  // #switch_id
        var id = index[1];
        var room = index[2];
        event.preventDefault();
        var data = {};
        //console.log(id);
        data.id = id;
        data.room = room;
        //console.log(local_id);
        data.message = "false";

        //wyślij dane na serwer
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/home/devices/:switch',
            success: function (data) {
                console.log('success');
                window.location.reload();
                //console.log(JSON.stringify(data));
            }
        });
    });
});