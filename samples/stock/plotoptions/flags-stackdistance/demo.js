(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        xAxis: {
            max: '2015-10-10'
        },

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
                x: '2015-08-25',
                title: 'E',
                text: 'Euro Contained by Channel Resistance'
            }, {
                x: '2015-08-25',
                title: 'D',
                text: 'EURUSD: Bulls Clear Path to 1.50 Figure'
            }, {
                x: '2015-08-25',
                title: 'C',
                text: 'EURUSD: Rate Decision to End Standstill'
            }, {
                x: '2015-08-25',
                title: 'B',
                text: 'EURUSD: Enter Short on Channel Break'
            }, {
                x: '2015-08-25',
                title: 'A',
                text: 'Forex: U.S. Non-Farm Payrolls Expand 244K, U.S. ' +
                    'Dollar Rally Cut Short By Risk Appetite'
            }],
            onSeries: 'dataseries',
            shape: 'circlepin',
            stackDistance: 30
        }]
    });
})();