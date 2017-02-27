// zależności modułów
var express = require('express');
var router = express.Router();

router.param('add', function(req, res, next, event){
    console.log('Event was detected: ', event);
    next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        // find() and sort rooms by levels in database
        var db = req.db;
        var roomsCollection = db.get('roomscollection');

        // Sortuj alfabetycznie według poziomu w budynku
        roomsCollection.find({}, {"sort": ['levelName', 'asc']}, function (e, docs) {
            res.render('settings/add_device', {
                title: 'Dodaj urządzenie',
                current_url: req.originalUrl,
                username: login,
                roomList: docs
            });
        });
    } else {
        next();
    }
});

/* POST to Add Device */
router.post('/:add', function(req, res) {
    if('/:add' == req.url && 'POST' == req.method) {
        // Ustaw wewnętrzną zmienną DB
        var db = req.db;

        // Wartości z <form> zależne od atrybutu "name"
        var deviceName = req.body.device_name;
        var deviceType = req.body.device_type;
        var roomID = req.body.roomID;
        // Ustaw kolekcję
        var devicesCollection = db.get('devicescollection');

        var data; // wybierz wartość początokową dla wybranego typu modułu

        //dodatkowe zmienne urządzeń - obejmuje też devices_panel.js
        if(deviceType === 'Alarm')
        {
            var alarm = false;
            data = alarm;
        }
        if(deviceType === 'Przełącznik')
        {
            var przelacznik = false;
            data = przelacznik;
        }
        if(deviceType === 'Czujnik temperatury i wilgotności')
        {
            var temp = 0;
            data = temp;
        }
        if(deviceType === 'Czujnik natężenia światła')
        {
            var light = 0;
            data = light;
        }
        // zapisz do DB
        devicesCollection.insert({
            "deviceName": deviceName,
            "deviceType": deviceType,
            "roomID": roomID,
            "data": data
        }, function (err, doc) {
            if (err) {
                console.log('Wystąpił problem z dodaniem informacji do bazy danych.');
            }
            else {
                // Gdy zapis prawidłowy, przekieruj na obecną stronę
                console.log(deviceName + ' ' + deviceType + ' ' + roomID);
                res.redirect('/settings/add_device');
            }
        });
    } else {
        next();
    }
});


module.exports = router;
