// zależności modułów
var express = require('express');
var router = express.Router();

router.param('delete', function(req, res, next, event){
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
            res.render('settings/devices_config', {
                title: 'Konfiguracja urządzeń',
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



/* POST to Delete Devise */
router.post('/:delete', function(req, res) {
    if('/:delete' == req.url && 'POST' == req.method) {

        //Ustaw wewnętrzną zmienną DB
        var db = req.db;

        // Ustaw kolekcję
        var devicesCollection = db.get('devicescollection');

        // Wartości z <form> zależne od atrybutu "name"
        var id = req.body.id;
        var message = req.body.message
        console.log("  usunięto: " + id);
        console.log('  event: ' + message);

        // Usuń z DB
        devicesCollection.remove({
            "_id": id
        }, function (err, doc) {
            if (err) {
                // Gdy zapis się nie powiedzie, zwróć error
                console.log('Wystąpił problem z dodaniem informacji do bazy danych.');
                //res.redirect(req.originalUrl);
            }
            else {
                // Gdy zapis prawidłowy, przekieruj na obecną stronę
                res.redirect('/settings/devices_config');
            }
        });

    } else {
        next();
    }
});


module.exports = router;
