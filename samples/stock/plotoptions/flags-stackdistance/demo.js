(async () => {

    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        xAxis: {
            max: Date.UTC(2015, 9, 10)
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
                x: Date.UTC(2015, 7, 25),
                title: 'E',
                text: 'Euro Contained by Channel Resistance'
            }, {
                x: Date.UTC(2015, 7, 25),
                title: 'D',
                text: 'EURUSD: Bulls Clear Path to 1.50 Figure'
            }, {
                x: Date.UTC(2015, 7, 25),
                title: 'C',
                text: 'EURUSD: Rate Decision to End Standstill'
            }, {
                x: Date.UTC(2015, 7, 25),
                title: 'B',
                text: 'EURUSD: Enter Short on Channel Break'
            }, {
                x: Date.UTC(2015, 7, 25),
                title: 'A',
                text: 'Forex: U.S. Non-Farm Payrolls Expand 244K, U.S. Dollar Rally Cut Short By Risk Appetite'
            }],
            onSeries: 'dataseries',
            shape: 'circlepin',
            stackDistance: 30
        }]
    });
})();