

Highcharts.chart('container', {

    exporting: {
        chartOptions: { // specific options for the exported image
            plotOptions: {
                series: {
                    dataLabels: {
                        useHTML: true,
                        enabled: true
                    }
                }
            }
        },
        scale: 3,
        fallbackToExportServer: false,
        error: function (opt, err) {
            console.log('Failed with error: "' + err + '". Options:', opt);
        },
        allowHTML: true
    },

    title: {
        text: 'Offline export'
    },

    subtitle: {
        text: 'Should fail for all except SVG'
    },

    chart: {
        type: 'area'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 126.0, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]

});

