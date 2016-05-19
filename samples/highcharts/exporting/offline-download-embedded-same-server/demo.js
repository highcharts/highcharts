$(function () {

    $('#container').highcharts({

        exporting: {
            chartOptions: { // specific options for the exported image
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                }
            },
            scale: 3,
            fallbackToExportServer: false
        },

        title: {
            text: 'Offline export w/embedded images'
        },

        subtitle: {
            text: 'Click the button to download as PNG/JPEG/SVG'
        },

        chart: {
            type: 'area'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, {
                y: 106.4,
                marker: {
                    symbol: 'url(testimage.png)'
                }
            }, 129.2, 144.0, 176.0, 135.6, {
                y: 126,
                marker: {
                    symbol: 'url(testimage.png)'
                }
            }, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

});
