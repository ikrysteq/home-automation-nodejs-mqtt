/**
 * Created by ikrysteq on 03.01.2017.
 */
//cały url:
//var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

// zależności modułów
var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        //Ustaw wewnętrzną zmienną DB
        var db = req.db;

        // Ustaw kolekcję
        var scenarioCollection = db.get('scenariocollection');

        scenarioCollection.find({}, {}, function (err, docs) {
            if (err) {
                // Gdy zapis się nie powiedzie, zwróć error
                console.log('Wystąpił problem z pobraniem informacji z bazy danych.');
            }
            else {
                function anyScenario(element, index, array) {
                    return (element.data == 'false');
                }
                var allScenesOff = docs.every(anyScenario);
                res.render('home', {
                    title: 'Panel główny',
                    current_url: req.originalUrl,
                    username: login,
                    scenarioList: docs,
                    allScenesOff: allScenesOff
                });
                console.log('url: ' + req.originalUrl);
            }
        });


    } else {
        next();
    }
});


module.exports = router;
