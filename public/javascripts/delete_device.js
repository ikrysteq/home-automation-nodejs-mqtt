

$(document).ready(function() {
    // usuń pokój z listy
    $('.button_delete').click( function (event) {
        var index = $(this).attr('id').split('_');  // #button_delete_i
        var i = index[2];
        event.preventDefault();
        var data = {};
        //console.log(data);
        data.id = local_id[i];  // id z bazy jakie chcemy usunąć
        //console.log(local_id);
        data.message = "delete_device";

        //wyślij dane na serwer
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/settings/devices_config/:delete',
            success: function (data) {
                console.log('success');
                window.location.reload();
                //console.log(JSON.stringify(data));
            }
        });
    });
});