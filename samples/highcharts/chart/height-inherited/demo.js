Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'The height of this chart is inherited'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr'
        ]
    },
    yAxis: {
        title: false
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2
        ]
    }]
});