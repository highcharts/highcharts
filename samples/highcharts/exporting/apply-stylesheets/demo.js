Highcharts.chart('container', {
    exporting: {
        applyStyleSheets: false // Don't loose CSS during exporting
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column'
    }]
});