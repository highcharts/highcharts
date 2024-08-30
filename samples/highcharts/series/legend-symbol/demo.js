Highcharts.chart('container', {

    chart: {
        type: 'area'
    },

    title: {
        text: 'Legend symbol options'
    },

    caption: {
        text: '*) Rectangle appears as a circle because of the default ' +
            '<a href="https://api.highcharts.com/highcharts/legend.symbolRadius">' +
            'legend.symbolRadius</a>.'
    },

    series: [{
        name: 'areaMarker (default)',
        data: [1, 2, 3, 2, 4]
    }, {
        data: [2, 3, 2, 5, 4],
        legendSymbol: 'lineMarker',
        name: 'lineMarker'
    }, {
        data: [1, 0, 1, 1, 0],
        legendSymbol: 'rectangle',
        name: 'rectangle *'
    }]
});