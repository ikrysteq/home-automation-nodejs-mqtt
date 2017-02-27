$(function() {
    var temp = c3.generate({
        data: {
            x: 'x',
            //xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
            columns: [
                ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
                // ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
                ['Czujnik A', 100, 50, 300, 0, 0, 0],
                ['Czujnik B', 130, 100, 140, 200, 150, 50]
            ],
            types: {
                'Czujnik A': 'area-spline',
                'Czujnik B': 'area'
            }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            },
            y: {
                label: {
                    text: 'Temperatura °C',
                    position: 'outer-middle'
                }
            }
        },
        bindto: d3.select('#temperature')
    });



    var humidity = c3.generate({
        data: {
            x: 'x',
            //xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
            columns: [
                ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
                // ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
                ['Czujnik1', 300, 350, 300, 0, 0, 0],
                ['Czujnik2', 130, 100, 140, 200, 150, 50]
            ],
            types: {
                'Czujnik1': 'area',
                'Czujnik2': 'area-spline'
            }
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            },
            y: {
                label: {
                    text: 'Wilgotność %',
                    position: 'outer-middle'
                }
            }
        },
        bindto: d3.select('#humidity')
    });

});