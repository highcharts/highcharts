Highcharts.chart('container', {

    chart: {
        type: 'area'
    },

    boost: {
        useGPUTranslations: true
    },

    series: [{
        boostThreshold: 1,
        data: [[0, 0], [1, -15], [2, 15]],
        threshold: null,
        name: 'Series starts from yAxis.min'
    }, {
        boostThreshold: 1,
        data: [[3, 0], [4, -15], [5, 15]],
        threshold: -10,
        name: 'Series starts from -10'
    }, {
        boostThreshold: 1,
        data: [[6, 0], [7, -15], [8, 15]],
        threshold: 10,
        name: 'Series starts from 10'
    }]
});