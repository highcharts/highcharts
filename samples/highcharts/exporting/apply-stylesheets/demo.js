Highcharts.chart('container', {
    exporting: {
        applyStyleSheets: true   // Don't lose CSS during exporting
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column'
    }]
});