const chart = Highcharts.stockChart('container', {

    navigator: {
        stickToMax: false
    },

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
        }],
        selected: 0
    },

    series: [{
        data: (function () {
            const data = [];

            for (let i = 0; i <= 10; i++) {
                data.push([
                    i * 10000,
                    Math.round(Math.random() * 100)
                ]);
            }
            return data;
        }())
    }]
});

// Two points added with a 1s delay, notice how navigator stays with the initial
// points range.
setTimeout(() => {
    chart.series[0].addPoint([110000, 50], false);
    chart.series[0].addPoint([120000, 100]);
}, 1000);