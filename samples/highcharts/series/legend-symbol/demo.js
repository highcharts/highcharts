Highcharts.chart('container', {
    title: {
        text: 'Changing the legend symbol'
    },

    series: [{
        type: 'area',
        name: 'Default legend symbol',
        data: [1, 2, 3, 2, 4]
    }, {
        type: 'area',
        data: [2, 3, 2, 5, 4],
        legendSymbol: 'lineMarker',
        name: 'lineMarker'
    }]
});