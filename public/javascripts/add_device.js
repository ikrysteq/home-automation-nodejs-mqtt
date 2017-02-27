//
//
// $(document).ready(function() {
//     // dodaj urządzenie do listy
//     $('#button_add').click( function (event) {
//         var index = $(this).attr('id').split('_');  // #button_delete_i
//         var i = index[2];
//         event.preventDefault();
//         var data = {};
//         //console.log(data);
//         data.id = local_id[i];
//         //console.log(local_id);
//         data.message = "add_room";
//
//         //wyślij dane na serwer
//         $.ajax({
//             type: 'POST',
//             data: JSON.stringify(data),
//             contentType: 'application/json',
//             url: '/settings/device_c/:add',
//             success: function (data) {
//                 console.log('success');
//                 window.location.reload();
//                 //console.log(JSON.stringify(data));
//             }
//         });
//     });
// });