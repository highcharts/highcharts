
Highcharts.stockChart('container', {

    tooltip: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderRadius: 0,
        headerFormat: '{point.key} ',
        pointFormat: ' | <span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>',
        positioner: function () {
            return { x: 10, y: 35 };
        },
        shadow: false,
        split: false
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'USD to EUR',
        data: usdeur
    }]
});