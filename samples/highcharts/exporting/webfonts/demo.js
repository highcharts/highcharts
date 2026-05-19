Highcharts.chart('container', {
    chart: {
        type: 'area',
        style: {
            fontFamily: 'Iceberg'
        }
    },

    title: {
        text: 'Web fonts',
        style: {
            fontFamily: 'Ole',
            fontSize: '3em',
            fontWeight: 800
        }
    },

    subtitle: {
        text: 'Download as PNG, JPEG, SVG or PDF'
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
