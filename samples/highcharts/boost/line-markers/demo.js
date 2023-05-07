const chart = Highcharts.chart('container', {

    boost: {
        useGPUTranslations: true
    },

    plotOptions: {
        series: {
            boostThreshold: 1,
            marker: {
                enabled: true
            }
        }
    },

    title: {
        text: 'Highcharts WebGL (boost) rendering with markers'
    },

    series: [{
        data: [11, 10, 12, 11, 10, 13]
    }]

});
chart.series[0].remove(); // test boost refresh after empty series array
chart.addSeries({
    data: [1, 3, 2, 4, 5, 3]
});
chart.addSeries({
    data: [6, 5, 7, 6, 8, 4]
});
chart.addSeries({
    data: [9, 8, 9, 8, 7, 9]
});
chart.addSeries({
    data: [11, 10, 12, 11, 10, 13],
    type: 'scatter'
});
