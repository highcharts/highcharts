
$.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json', function (data) {

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
            data: [{
                x: Date.UTC(2017, 11, 1),
                title: 'A',
                text: 'Some event with a description'
            }, {
                x: Date.UTC(2017, 11, 12),
                title: 'B',
                text: 'Some event with a description'
            }, {
                x: Date.UTC(2017, 11, 22),
                title: 'C',
                text: 'Some event with a description'
            }],
            onSeries: 'dataseries',
            shape: 'circlepin',
            width: 16
        }]
    });
});
