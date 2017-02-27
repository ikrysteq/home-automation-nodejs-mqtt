// zależności modułów
var express = require('express');
var router = express.Router();

router.param('switch', function(req, res, next, event){
    console.log('Event was detected: ', event);
    next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        var scenario;

        // find() and sort devices by type in database
        var db = req.db;
        var scenarioCollection = db.get('scenariocollection');

        scenarioCollection.find({}, {}, function (e, docs) {
            scenario = docs;
        });

        scenarioCollection.find({}, {}, function (e, docs) {
            res.render('home/scenes', {
                title: 'Scenariusze',
                current_url: req.originalUrl,
                username: login,
                deviceList: docs,
                scenarioList: scenario
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

        // Ustaw kolekcję
        var scenarioCollection = db.get('scenariocollection');

        // Wartości z <form> zależne od atrybutu "name"
        var id = req.body.id;
        var message = req.body.message
        console.log("  zmodyfikowano: " + id);
        console.log('  wartość: ' + message);

        // Zmień z DB
        scenarioCollection.update({"_id": id}, {$set:{"data": message}}, function (err, doc) {
            if (err) {
                // Gdy zapis się nie powiedzie, zwróć error
                console.log('Wystąpił problem z dodaniem informacji do bazy danych.');
            }
            else {
                // Gdy zapis prawidłowy, przekieruj na obecną stronę
                setTimeout(function () {
                    res.redirect('/home/scenes');

                },200);
            }
        });

    } else {
        next();
    }
});


module.exports = router;
