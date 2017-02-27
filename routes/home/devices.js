/**
 * Created by ikrysteq on 05.01.2017.
 */
// zależności modułów
var express = require('express');
var router = express.Router();
var MQTT_client = require('../../sockets_server/mqtt');



router.param('switch', function(req, res, next, event){
    console.log('Event was detected: ', event);
    next();
});



/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        var rooms;

        // find() and sort devices by type in database
        var db = req.db;
        var devicesCollection = db.get('devicescollection');
        var roomsCollection = db.get('roomscollection');

        roomsCollection.find({}, {}, function (e, docs) {
            rooms = docs;
        });

        // Sortuj alfabetycznie według typu urządzenia
        // (najpierw ABCDEF... potem abcdef...)
        devicesCollection.find({}, {"sort": ['deviceType', 'asc']}, function (e, docs) {
            res.render('home/devices', {
                title: 'Urządzenia',
                current_url: req.originalUrl,
                username: login,
                deviceList: docs,
                roomList: rooms
            });
        });

    } else {
        next();
    }
});


/* POST to switch scenario */
router.post('/:switch', function(req, res) {
    if('/:switch' == req.url && 'POST' == req.method) {

        //Ustaw wewnętrzną zmienną DB
        var db = req.db;
        var deviceName;

        // Ustaw kolekcję
        var devicesCollection = db.get('devicescollection');
        var roomsCollection = db.get('roomscollection');

        // Wartości z <form> zależne od atrybutu "name"
        var id = req.body.id;
        var message = req.body.message;
        var roomID = req.body.room;
        console.log("  zmodyfikowano: " + id);
        console.log('  wartość: ' + message);

        // Zmień z DB
        devicesCollection.update({"_id": id}, {$set:{"data": message}}, function (err, docs) {
            if (err) {
                // Gdy zapis się nie powiedzie, zwróć error
                console.log('Wystąpił problem ze zmianą informacji w bazie danych.');
            }
            else {
                deviceName = docs.deviceName;
                console.log('ROOM    :  ' + roomID);
                devicesCollection.findOne({'_id': id}, {}, function (err, docs) {
                   if(err) {
                       console.log('Wystąpił problem z pobraniem informacji z bazy danych.');
                   } else {
                       deviceName = docs.deviceName;
                   }
                });
                roomsCollection.findOne({'_id': roomID}, {}, function (err, docs) {
                    if (err) {
                        console.log('Wystąpił problem z pobraniem informacji z bazy danych.');
                    }
                    else {
                        var level = docs.levelName;
                        var room  = docs.roomName;
                        //console.log('uruchamiam mqtt publish');
                        MQTT_client.mqtt_publish(level,room,deviceName,message);    // publikuj wiadomość MQTT: funkcja mqtt_() w mqtt.js
                    }
                    // Gdy zapis prawidłowy, przekieruj na obecną stronę
                    setTimeout(function () {
                        res.redirect('/home/devices');
                    },10);
                });
            }

        });




    } else {
        next();
    }
});


module.exports = router;
