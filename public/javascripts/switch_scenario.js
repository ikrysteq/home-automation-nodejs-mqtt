$(document).ready(function() {
    // włącz scenę
    $('.btn-primary').click( function (event) {
        var index = $(this).attr('id').split('_');  // #switch_i
        var i = index[1];
        event.preventDefault();
        var data = {};
        //console.log(i);
        data.id = i;  // id z bazy jakie chcemy usunąć
        //console.log(local_id);
        data.message = "true";

        //wyślij dane na serwer
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/home/scenes/:switch',
            success: function (data) {
                console.log('success');
                window.location.reload();
                //console.log(JSON.stringify(data));
            }
        });
    });



    // wyłącz scenę
    $('.btn-info').click( function (event) {
        var index = $(this).attr('id').split('_');  // #switch_i
        var i = index[1];
        event.preventDefault();
        var data = {};
        //console.log(i);
        data.id = i;  // id z bazy jakie chcemy usunąć
        //console.log(local_id);
        data.message = "false";

        //wyślij dane na serwer
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/home/scenes/:switch',
            success: function (data) {
                console.log('success');
                window.location.reload();
                //console.log(JSON.stringify(data));
            }
        });
    });
});