// modules
var monk = require('monk'); // pomocnik dla MongoDB
var mqtt = require('mqtt');
//var io = require('socket.io').listen(server);

/**
 *  Create MQTT client
 */

var roomsColl = [];                    // roomsCollection
var devicesColl = [];                  //devicesCollection
var levels = [];                       // dane pokoi indeksowane wg indeksu urządzeń
var rooms = [];                        // dane pokoi indeksowane wg indeksu urządzeń
var mqtt_data = [];                    // dane MQTT z DB
var MQTT_options = {};                 // dane MQTT lokalnie
var subscribed_topics = [];            // urządzenia subskrybowane MQTT i tematy domyślne


// Ustaw wewnętrzną zmienną DB
var db = monk('localhost:27017/database');
// Ustaw kolekcję
var devicesCollection = db.get('devicescollection');
var roomsCollection = db.get('roomscollection');
var mqttCollection = db.get('mqttcollection');


var deviceType;
var deviceID;
var roomID;
var socket_message;


// MQTT receiver with Socket.io
exports.mqtt_on = function (io) {
    /**
     * DOWNLOAD DATA ABOUT MQTT AND TOPICS FROM DB
     */
    // MQTT: Pobierz dane z DB
    mqttCollection.findOne({protocol: "mqtt"}, {}, function (err, docs) {
        if (err) {
            console.log('Wystąpił problem z pobraniem informacji z bazy danych.');
        }
        else {
            mqtt_data = docs;
            //console.log(mqtt_data);
            var mqtt_clientid = mqtt_data.clientid.toString()  + '_' + Math.random().toString(16).substr(2, 8);
            MQTT_options = {
                port: Number(mqtt_data.port),
                host: mqtt_data.host,
                clean: mqtt_data.clean,
                keepalive: mqtt_data.keepalive * 1000,
                clientId: mqtt_clientid,
            };

            mqttCollection.update({protocol: 'mqtt'}, {
                $set: {
                    "port": MQTT_options.port,
                    "host": MQTT_options.host,
                    "qos": Number(mqtt_data.qos),
                    "clean": MQTT_options.clean,
                    "keepalive": mqtt_data.keepalive,
                    "clientid": mqtt_data.clientid.toString()
                }
            }, function (err, doc) {
                if (err) {
                    console.log('Wystąpił problem ze zmianą informacji w bazie danych.');
                }
                else {
                }
            });

        }

   });




    // Pobierz z DB
    // Sortuj alfabetycznie według typu urządzenia
    devicesCollection.find({}, {"sort": ['deviceType', 'asc']}, function (e, docs) {
        devicesColl = docs;
    });

    // Pobierz z DB
    roomsCollection.find({}, {}, function (e, docs) {
        roomsColl = docs;


    }).then(function () {
        // przypisanie pokoi i poziomu do urządzeń wg roomID
        devicesColl.forEach(function(element, index, array) {
            for (var n = 0; n < roomsColl.length; n++) {

                if (roomsColl[n]._id.toString() === devicesColl[index].roomID) {
                    rooms[index] = roomsColl[n].roomName;
                    levels[index] = roomsColl[n].levelName;
                    //console.log("[" + index + "] " + devicesColl[index].deviceName + ": " + devicesColl[index].roomID + " == " + roomsColl[n]._id);
                    break;
                }
            }
        })
    }).then(function () {
        // zapis tematów MQTT
        devicesColl.forEach(function(element, index, array) {
            var mqtt_topic = 'home/' + levels[index] + '/' + rooms[index] + '/' + element.deviceName;
            subscribed_topics.push(mqtt_topic);
        });
    }).then(function () {

        /**
         *  MQTT CLIENT
         */

        var client = mqtt.connect('mqtt://' + MQTT_options.host + ':' + MQTT_options.port, MQTT_options);

        // Połączenie z brokerem:
        client.on('connect', function (packet) {
            console.log('MQTT connected: "mqtt://' + MQTT_options.host + ':' + MQTT_options.port + '", cliendId: "' + MQTT_options.clientId + '"');
            client.subscribe(subscribed_topics, {qos: mqtt_data.qos}, function (err, granted) {
                console.log('Topics:');
                console.log(granted);
            });
            client.publish('home', 'Hello from: ' + MQTT_options.clientId);
        });

        /**
         * Obsługa danych od modułów MQTT i przesłanie ich do DB oraz socket.io
         */
        //io.on('connection', function (socket) { //socket.io

            client.on('message', function (topic, message, packet) {                  //mqtt
                console.log(" received '" + message + "' on '" + topic + "'");

                //można subskrybować tablicę topics[] lub obiekt {topic1: 'kot', topic2: pies}
                client.subscribe(subscribed_topics, function () {
                    // when a message arrives, do something with it

                    //przetworzenie tematu
                    var topic_array = topic.split(/\//g);
                    var level = topic_array[1];
                    var room = topic_array[2];
                    var devicename = topic_array[3];

                    //console.log(topic_array);

                    // Znajdź ID pokoju odpowiadające tematowi MQTT z którego przyszła wiadomość
                    roomsCollection.findOne({roomName: room, levelName: level}, function (err, docs) {
                        if (err) {
                            console.log('Wystąpił problem ze znalezieniem informacji z bazy danych.');
                        }
                        else {
                            roomID = docs._id.toString();

                        }
                    }).then(function () {
                        // Znajdź ID urządzenia na podstawie ID pokoju w którym jest urządzenie
                        devicesCollection.findOne({deviceName: devicename, roomID: roomID}, function (err, documents) {
                            if (err) {
                                console.log('Wystąpił problem ze znalezieniem informacji z bazy danych.');
                            }
                            else {
                                deviceID = documents._id.toString();
                                deviceType = documents.deviceType;
                                //console.log(deviceID);


                                // Zapisz do DB dane z MQTT
                                devicesCollection.update({_id: deviceID}, {$set: {data: message.toString()}}, function (err, doc) {
                                    if (err) {
                                        console.log('Wystąpił problem z aktualizowaniem informacji do bazy danych.');
                                    }
                                    else {
                                        //console.log(topic);
                                        console.log(message.toString());
                                        socket_message = message.toString();

                                    }
                                });

                            }

                        });
                    });

                });

            });
       // });

        client.on('error', function (error) {
            console.error('MQTT: ERROR!!! client cannot connect to broker or a parsing error occurs.');
           // client.end();
        });

    });
    /**
     * Eksport wiadomości MQTT do Socket.io
     */
    io.on('connection', function (socket) { //socket.io
        function devicesInfoUpdate() {
            try {
                    // dane bezpośrednio z mqtt
                    socket.emit('mqtt', {
                        deviceID: deviceID,
                        roomID: roomID,
                        deviceType: deviceType,
                        message: socket_message
                    });

            } catch (e) {
            console.error(e)
        }
        setTimeout(devicesInfoUpdate, 1000);
        }
        devicesInfoUpdate();
    });

}

// MQTT receiver with Socket.io
exports.mqtt_publish = function (level,room,device,message) {
    /**
     *  MQTT CLIENT PUBLISH MSG
     */

    var topic = 'home/' + level + '/' + room + '/' + device;
    var client = mqtt.connect('mqtt://' + MQTT_options.host + ':' + MQTT_options.port);
    client.on('connect', function (packet) {
        console.log('MQTT: topic: ' + topic + ' publish message: ' + message);
        client.publish(topic, message);
        client.end();

    });
    return true;
}




