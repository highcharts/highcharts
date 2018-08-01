Highcharts.chart('container', {
    title: {
        text: 'Navigate chart with keyboard'
    },

    tooltip: {
        enabled: false
    },

    legend: {
        useHTML: true
    },

    series: [{
        data: [74, 69.6, 63.7, 63.9, 43.7]
    }]
});
