Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.stackLabels.style</em> options'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        stackLabels: {
            enabled: true,
            style: {
                color: '#00c000',
                fontSize: '0.9em',
                fontWeight: 'bold',
                textOutline: 'none'
            }
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2]
    }, {
        data: [144, 176, 135.6, 148.5]
    }]
} satisfies Highcharts.Options);
