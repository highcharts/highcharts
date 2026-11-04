const chart = Highcharts.stockChart('container', {

    navigator: {
        stickToMax: false
    },

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'week',
            text: '1W'
        }],
        selected: 0
    },

    series: [{
        pointStart: '2025-01-01',
        pointInterval: 24 * 36e5,
        data: Array.from({ length: 10 }, () => [Math.random() * 100])
    }]
});

// Two points added with a 1s delay, notice how navigator stays with the initial
// points range.
setTimeout(() => {
    chart.series[0].addPoint(50, false);
    chart.series[0].addPoint(100);
}, 1000);