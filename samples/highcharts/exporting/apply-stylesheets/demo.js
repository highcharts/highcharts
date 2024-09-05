Highcharts.chart('container', {
    exporting: {
        applyStyleSheets: true // Don't loose CSS during exporting
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column'
    }]
});