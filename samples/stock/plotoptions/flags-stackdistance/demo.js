
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
            x: Date.UTC(2015, 6, 25),
            title: 'H',
            text: 'Euro Contained by Channel Resistance'
        }, {
            x: Date.UTC(2015, 6, 28),
            title: 'G',
            text: 'EURUSD: Bulls Clear Path to 1.50 Figure'
        }, {
            x: Date.UTC(2015, 7, 4),
            title: 'F',
            text: 'EURUSD: Rate Decision to End Standstill'
        }, {
            x: Date.UTC(2015, 7, 5),
            title: 'E',
            text: 'EURUSD: Enter Short on Channel Break'
        }, {
            x: Date.UTC(2015, 7, 6),
            title: 'D',
            text: 'Forex: U.S. Non-Farm Payrolls Expand 244K, U.S. Dollar Rally Cut Short By Risk Appetite'
        }, {
            x: Date.UTC(2015, 7, 6),
            title: 'C',
            text: 'US Dollar: Is This the Long-Awaited Recovery or a Temporary Bounce?'
        }, {
            x: Date.UTC(2015, 7, 9),
            title: 'B',
            text: 'EURUSD: Bearish Trend Change on Tap?'
        }],
        onSeries: 'dataseries',
        shape: 'circlepin',
        stackDistance: 20,
        width: 16
    }]
});