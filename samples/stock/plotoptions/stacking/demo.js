
Highcharts.stockChart('container', {

    chart: {
        type: 'area'
    },

    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

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