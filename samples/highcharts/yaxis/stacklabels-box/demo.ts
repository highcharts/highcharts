Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Stack labels box options'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        stackLabels: {
            backgroundColor: '#80808040',
            borderColor: '#80808080',
            borderRadius: 5,
            borderWidth: 1,
            enabled: true,
            y: -5
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
