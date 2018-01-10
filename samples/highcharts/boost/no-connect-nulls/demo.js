console.time('line');

Highcharts.chart('container', {
    chart: {
        zoomType: 'x',
        panning: true,
        panKey: 'shift'
    },

    boost: {
        useGPUTranslations: true,
        seriesThreshold: 1
    },

    title: {
        text: 'Boost connectNulls: false'
    },

    tooltip: {
        valueDecimals: 2
    },

    series: [{
        lineWidth: 0.5,
        connectNulls: false,
        data: [
            [0, 1],
            [1, 5],
            [2, null],
            [3, 3],
            [4, 0]
        ]
    }]
});

console.timeEnd('line');
