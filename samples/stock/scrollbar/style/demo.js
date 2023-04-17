Highcharts.stockChart('container', {

    scrollbar: {
        barBackgroundColor: '#dddddd',
        barBorderRadius: 5,
        barBorderWidth: 0,
        buttonsEnabled: false,
        rifleColor: 'transparent',
        trackBackgroundColor: '#fafafa',
        trackBorderWidth: 1,
        trackBorderColor: '#cccccc',
        trackBorderRadius: 5,
        height: 10
    },

    navigator: {
        maskInside: false
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur.splice(usdeur.length - 250)
    }]
});