// zależności modułów
var express = require('express');
var router = express.Router();

router.param('delete', function(req, res, next, event){
    console.log('Event was detected: ', event);
    next();
});

/* GET list rooms */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        // find() and sort rooms by levels in database
        var db = req.db;
        var roomsCollection = db.get('roomscollection');

        // Sortuj alfabetycznie według poziomu w budynku
        // (najpierw ABCDEF... potem abcdef...)
        roomsCollection.find({}, {"sort": ['levelName', 'asc']}, function (e, docs) {
            res.render('settings/rooms_config', {
                title: 'Konfiguracja pomieszczeń',
                current_url: req.originalUrl,
                username: login,
                roomList: docs
            });
        });
    } else {
        next();
    }
});

/* POST to Add Room */
router.post('/', function(req, res) {
    if('/' == req.url && 'POST' == req.method) {
        // Ustaw wewnętrzną zmienną DB
        var db = req.db;

        // Wartości z <form> zależne od atrybutu "name"
        var roomName = req.body.room_name;
        var levelName = req.body.level;
        // Ustaw kolekcję
        var roomsCollection = db.get('roomscollection');

        // Wyślij do DB
        roomsCollection.insert({
            "roomName": roomName,
            "levelName": levelName
        }, function (err, doc) {
            if (err) {
                // Gdy zapis się nie powiedzie, zwróć error
                console.log('Wystąpił problem z dodaniem informacji do bazy danych.');
                res.send("Wystąpił problem z dodaniem informacji do bazy danych.");
            }
            else {
                // Gdy zapis prawidłowy, przekieruj na obecną stronę
                res.redirect(req.originalUrl);
            }
        });
    } else {
        next();
    }
});



/* POST to Delete Room */
router.post('/:delete', function(req, res) {
    if('/:delete' == req.url && 'POST' == req.method) {

        //Ustaw wewnętrzną zmienną DB
        var db = req.db;

        // Ustaw kolekcję
        var roomsCollection = db.get('roomscollection');

        // Wartości z <form> zależne od atrybutu "name"
        var id = req.body.id;
        var message = req.body.message
        console.log("  usunięto: " + id);
        console.log('  event: ' + message);

        // Usuń z DB
        roomsCollection.remove({
            "_id": id
        }, function (err, doc) {
            if (err) {
                // Gdy zapis się nie powiedzie, zwróć error
                console.log('Wystąpił problem z dodaniem informacji do bazy danych.');
                res.send("Wystąpił problem z dodaniem informacji do bazy danych.");
                //res.redirect(req.originalUrl);
            }
            else {
                // Gdy zapis prawidłowy, przekieruj na obecną stronę
                res.redirect('/settings/rooms_config');
            }
        });

    } else {
        next();
    }
});



module.exports = router;
