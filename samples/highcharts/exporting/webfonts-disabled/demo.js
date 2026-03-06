Highcharts.chart('container', {
    exporting: {
        chartOptions: {
            chart: {
                style: {
                    fontFamily: 'sans-serif'
                }
            }
        }
    },

    title: {
        text: 'Web font disabled in export'
    },

    subtitle: {
        text: 'Download as PNG, JPEG, SVG or PDF'
    },

    chart: {
        type: 'area',
        style: {
            fontFamily: 'Iceberg'
        }
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,
            126.0, 148.5, 216.4, 194.1, 95.6, 54.4
        ]
    }]

});
