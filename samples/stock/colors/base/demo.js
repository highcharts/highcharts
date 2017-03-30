
Highcharts.setOptions({
    colors: ['green', 'blue']
});
Highcharts.stockChart('container', {

    rangeSelector: {
        selected: 1
    },

    series: [{
        name: 'ADBE',
        data: ADBE
    }, {
        name: 'MSFT',
        data: MSFT
    }]
});