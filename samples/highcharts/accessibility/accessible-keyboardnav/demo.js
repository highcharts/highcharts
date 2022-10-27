Highcharts.chart('container', {
    title: {
        text: 'Navigate chart with keyboard'
    },

    exporting: {
        showTable: true
    },

    tooltip: {
        enabled: false
    },

    legend: {
        useHTML: true,
        layout: 'proximate',
        align: 'right'
    },

    series: [{
        data: [74, 69.6, 63.7, 43.7]
    }, {
        data: [74, 63.7, 23.9, 13.7]
    }]
});
