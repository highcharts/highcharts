Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>series.connectNulls</em>'
    },
    boost: {
        seriesThreshold: 1,
        useGPUTranslations: true
    },
    series: [{
        connectNulls: false,
        data: [
            [0, 1],
            [1, 5],
            [
                2,
                null
            ],
            [3, 3],
            [4, 0]
        ]
    }],
    tooltip: {
        valueDecimals: 2
    }
});
