$(function () {
    $('#container').highcharts('StockChart', {

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'USD to EUR',
            id: 'dataseries',
            data: usdeur
        }, {
            type: 'flags',
            data: [{
                x: Date.UTC(2011, 1, 14),
                title: 'A',
                text: 'Shape: "squarepin"'
            }, {
                x: Date.UTC(2011, 3, 28),
                title: 'A',
                text: 'Shape: "squarepin"'
            }],
            onSeries: 'dataseries',
            shape: 'squarepin',
            width: 16
        }, {
            type: 'flags',
            data: [{
                x: Date.UTC(2011, 2, 1),
                text: 'Shape: "circlepin"'
            }, {
                x: Date.UTC(2011, 3, 1),
                text: 'Shape: "circlepin"'
            }],
            shape: 'circlepin',
            title: 'B',
            width: 16
        }, {
            type: 'flags',
            data: [{
                x: Date.UTC(2011, 2, 10),
                title: 'C',
                text: 'Shape: "flag"'
            }, {
                x: Date.UTC(2011, 3, 11),
                title: 'C',
                text: 'Shape: "flag"'
            }],
            color: '#5F86B3',
            fillColor: '#5F86B3',
            onSeries: 'dataseries',
            width: 16,
            style: { // text style
                color: 'white'
            },
            states: {
                hover: {
                    fillColor: '#395C84' // darker
                }
            }
        }]
    });
});