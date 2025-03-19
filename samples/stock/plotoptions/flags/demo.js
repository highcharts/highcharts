(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

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
                x: '2015-06-14',
                title: 'A',
                text: 'Shape: "squarepin"'
            }, {
                x: '2015-08-28',
                title: 'A',
                text: 'Shape: "squarepin"'
            }],
            onSeries: 'dataseries',
            shape: 'squarepin',
            width: 16
        }, {
            type: 'flags',
            data: [{
                x: '2015-07-01',
                text: 'Shape: "circlepin"'
            }, {
                x: '2015-08-01',
                text: 'Shape: "circlepin"'
            }],
            shape: 'circlepin',
            title: 'B',
            width: 16
        }, {
            type: 'flags',
            data: [{
                x: '2015-07-10',
                title: 'C',
                text: 'Shape: "flag"'
            }, {
                x: '2015-08-11',
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
})();