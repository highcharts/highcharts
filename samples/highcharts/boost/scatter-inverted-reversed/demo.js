Highcharts.chart('container', {

    chart: {
        inverted: true
    },

    boost: {
        useGPUTranslations: true,
        usePreallocated: true
    },

    plotOptions: {
        series: {
            boostThreshold: 1
        }
    },

    xAxis: {
        reversed: true
    },

    yAxis: {
        reversed: true
    },

    series: [{
        type: 'scatter',
        data: [0, 1, 12, 3, 14, 5]
    }]

});