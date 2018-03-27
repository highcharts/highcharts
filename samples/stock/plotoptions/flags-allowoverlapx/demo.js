$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/usdeur.json', function (data) {

    // Create the chart
    Highcharts.stockChart('container', {


        rangeSelector: {
            selected: 0
        },

        title: {
            text: 'USD to EUR exchange rate'
        },

        tooltip: {
            style: {
                width: '200px'
            },
            valueDecimals: 4,
            shared: true
        },

        yAxis: {
            title: {
                text: 'Exchange rate'
            }
        },

        series: [{
            name: 'USD to EUR',
            data: data,
            id: 'dataseries'

            // the event marker flags
        }, {
            type: 'flags',
            allowOverlapX: true,
            data: [{
                x: Date.UTC(2015, 5, 12, 1),
                title: '1'
            }, {
                x: Date.UTC(2015, 5, 12, 2),
                title: '2'
            }, {
                x: Date.UTC(2015, 5, 12, 3),
                title: '3'
            }, {
                x: Date.UTC(2015, 5, 12, 4),
                title: '4'
            }, {
                x: Date.UTC(2015, 5, 12, 5),
                title: '5'
            }, {
                x: Date.UTC(2015, 5, 12, 6),
                title: '6'
            }, {
                x: Date.UTC(2015, 5, 12, 7),
                title: '7'
            }, {
                x: Date.UTC(2015, 5, 12, 8),
                title: '8'
            }, {
                x: Date.UTC(2015, 5, 12, 9),
                title: '9'
            },


            {
                x: Date.UTC(2015, 5, 13, 1),
                title: '1'
            }, {
                x: Date.UTC(2015, 5, 13, 2),
                title: '2'
            }, {
                x: Date.UTC(2015, 5, 13, 3),
                title: '3'
            }, {
                x: Date.UTC(2015, 5, 13, 4),
                title: '4'
            }, {
                x: Date.UTC(2015, 5, 13, 5),
                title: '5'
            }, {
                x: Date.UTC(2015, 5, 13, 6),
                title: '6'
            }, {
                x: Date.UTC(2015, 5, 13, 7),
                title: '7'
            }, {
                x: Date.UTC(2015, 5, 13, 8),
                title: '8'
            }, {
                x: Date.UTC(2015, 5, 13, 9),
                title: '9'
            },

            {
                x: Date.UTC(2015, 5, 14, 1),
                title: '1'
            }, {
                x: Date.UTC(2015, 5, 14, 2),
                title: '2'
            }, {
                x: Date.UTC(2015, 5, 14, 3),
                title: '3'
            }, {
                x: Date.UTC(2015, 5, 14, 4),
                title: '4'
            }, {
                x: Date.UTC(2015, 5, 14, 5),
                title: '5'
            }, {
                x: Date.UTC(2015, 5, 14, 6),
                title: '6'
            }, {
                x: Date.UTC(2015, 5, 14, 7),
                title: '7'
            }, {
                x: Date.UTC(2015, 5, 14, 8),
                title: '8'
            }, {
                x: Date.UTC(2015, 5, 14, 9),
                title: '9'
            },

            {
                x: Date.UTC(2015, 5, 15, 1),
                title: '1'
            }, {
                x: Date.UTC(2015, 5, 15, 2),
                title: '2'
            }, {
                x: Date.UTC(2015, 5, 15, 3),
                title: '3'
            }, {
                x: Date.UTC(2015, 5, 15, 4),
                title: '4'
            }, {
                x: Date.UTC(2015, 5, 15, 5),
                title: '5'
            }, {
                x: Date.UTC(2015, 5, 15, 6),
                title: '6'
            }, {
                x: Date.UTC(2015, 5, 15, 7),
                title: '7'
            }, {
                x: Date.UTC(2015, 5, 15, 8),
                title: '8'
            }, {
                x: Date.UTC(2015, 5, 15, 9),
                title: '9'
            },

            {
                x: Date.UTC(2015, 5, 16, 1),
                title: '1'
            }, {
                x: Date.UTC(2015, 5, 16, 2),
                title: '2'
            }, {
                x: Date.UTC(2015, 5, 16, 3),
                title: '3'
            }, {
                x: Date.UTC(2015, 5, 16, 4),
                title: '4'
            }, {
                x: Date.UTC(2015, 5, 16, 5),
                title: '5'
            }, {
                x: Date.UTC(2015, 5, 16, 6),
                title: '6'
            }, {
                x: Date.UTC(2015, 5, 16, 7),
                title: '7'
            }, {
                x: Date.UTC(2015, 5, 16, 8),
                title: '8'
            }, {
                x: Date.UTC(2015, 5, 16, 9),
                title: '9'
            }],
            onSeries: 'dataseries',
            shape: 'circlepin',
            width: 16
        }]
    });
});
