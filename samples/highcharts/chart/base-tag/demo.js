const data2 = [
    [1, 1],
    [1e11, 11]
];

const chart = Highcharts.stockChart('container', {
    plotOptions: {
        areaspline: {
            color: '#2494f2',
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, 'rgba(36,148,242,0.9)'],
                    [1, 'rgba(36,148,242,0)']
                ]
            },
            lineWidth: 5
        }
    },
    chart: {
        type: 'areaspline',
        zoomType: 'xy'
    },
    xAxis: {
        minRange: 1
    },
    series: [{
        data: data2
    }]
});

// Change the location using history.pushstate
// which does not trigger navigation in the browser
history.pushState({}, '', window.location.href + '?test');

// Move the rangeSelector
chart.update(
    {
        rangeSelector: {
            selected: 1
        }
    },
    true
);
