Highcharts.chart('container', {

    chart: {
        type: 'line'
    },

    boost: {
        useGPUTranslations: true
    },

    yAxis: {
        type: 'logarithmic'
    },

    series: [{
        boostThreshold: 1,
        data: [3, 2, 1, 50, 100, 100]
    }]

});
