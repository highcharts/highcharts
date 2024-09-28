(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    const year = 2021,
        monthIndex = 11;

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
            data: usdeur,
            id: 'dataseries'

            // the event marker flags
        }, {
            type: 'flags',
            allowOverlapX: true,
            data: [{
                x: Date.UTC(year, monthIndex, 12, 1),
                title: '1'
            }, {
                x: Date.UTC(year, monthIndex, 12, 2),
                title: '2'
            }, {
                x: Date.UTC(year, monthIndex, 12, 3),
                title: '3'
            }, {
                x: Date.UTC(year, monthIndex, 12, 4),
                title: '4'
            }, {
                x: Date.UTC(year, monthIndex, 12, 5),
                title: '5'
            }, {
                x: Date.UTC(year, monthIndex, 12, 6),
                title: '6'
            }, {
                x: Date.UTC(year, monthIndex, 12, 7),
                title: '7'
            }, {
                x: Date.UTC(year, monthIndex, 12, 8),
                title: '8'
            }, {
                x: Date.UTC(year, monthIndex, 12, 9),
                title: '9'
            },

            {
                x: Date.UTC(year, monthIndex, 13, 1),
                title: '1'
            }, {
                x: Date.UTC(year, monthIndex, 13, 2),
                title: '2'
            }, {
                x: Date.UTC(year, monthIndex, 13, 3),
                title: '3'
            }, {
                x: Date.UTC(year, monthIndex, 13, 4),
                title: '4'
            }, {
                x: Date.UTC(year, monthIndex, 13, 5),
                title: '5'
            }, {
                x: Date.UTC(year, monthIndex, 13, 6),
                title: '6'
            }, {
                x: Date.UTC(year, monthIndex, 13, 7),
                title: '7'
            }, {
                x: Date.UTC(year, monthIndex, 13, 8),
                title: '8'
            }, {
                x: Date.UTC(year, monthIndex, 13, 9),
                title: '9'
            },

            {
                x: Date.UTC(year, monthIndex, 14, 1),
                title: '1'
            }, {
                x: Date.UTC(year, monthIndex, 14, 2),
                title: '2'
            }, {
                x: Date.UTC(year, monthIndex, 14, 3),
                title: '3'
            }, {
                x: Date.UTC(year, monthIndex, 14, 4),
                title: '4'
            }, {
                x: Date.UTC(year, monthIndex, 14, 5),
                title: '5'
            }, {
                x: Date.UTC(year, monthIndex, 14, 6),
                title: '6'
            }, {
                x: Date.UTC(year, monthIndex, 14, 7),
                title: '7'
            }, {
                x: Date.UTC(year, monthIndex, 14, 8),
                title: '8'
            }, {
                x: Date.UTC(year, monthIndex, 14, 9),
                title: '9'
            },

            {
                x: Date.UTC(year, monthIndex, 15, 1),
                title: '1'
            }, {
                x: Date.UTC(year, monthIndex, 15, 2),
                title: '2'
            }, {
                x: Date.UTC(year, monthIndex, 15, 3),
                title: '3'
            }, {
                x: Date.UTC(year, monthIndex, 15, 4),
                title: '4'
            }, {
                x: Date.UTC(year, monthIndex, 15, 5),
                title: '5'
            }, {
                x: Date.UTC(year, monthIndex, 15, 6),
                title: '6'
            }, {
                x: Date.UTC(year, monthIndex, 15, 7),
                title: '7'
            }, {
                x: Date.UTC(year, monthIndex, 15, 8),
                title: '8'
            }, {
                x: Date.UTC(year, monthIndex, 15, 9),
                title: '9'
            },

            {
                x: Date.UTC(year, monthIndex, 16, 1),
                title: '1'
            }, {
                x: Date.UTC(year, monthIndex, 16, 2),
                title: '2'
            }, {
                x: Date.UTC(year, monthIndex, 16, 3),
                title: '3'
            }, {
                x: Date.UTC(year, monthIndex, 16, 4),
                title: '4'
            }, {
                x: Date.UTC(year, monthIndex, 16, 5),
                title: '5'
            }, {
                x: Date.UTC(year, monthIndex, 16, 6),
                title: '6'
            }, {
                x: Date.UTC(year, monthIndex, 16, 7),
                title: '7'
            }, {
                x: Date.UTC(year, monthIndex, 16, 8),
                title: '8'
            }, {
                x: Date.UTC(year, monthIndex, 16, 9),
                title: '9'
            }],
            onSeries: 'dataseries',
            shape: 'circlepin',
            width: 16
        }]
    });
})();