Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h5>{chartTitle}</h5>' +
                '<div>{typeDescription}</div>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{viewTableButton}</div>'
        }
    },
    title: {
        text: 'Monthly Sales Data'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        title: {
            enabled: false
        },
        labels: {
            format: '{text}K'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}K'
            }
        }
    },
    series: [{
        name: 'Sales',
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,
            148.5, 216.4, 194.1, 95.6, 54.4
        ]
    }]
});
