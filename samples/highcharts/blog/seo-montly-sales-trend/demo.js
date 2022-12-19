Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'SEO has increased B2B sales by 30% in Aug'
    },
    xAxis: {
        categories: ['May', 'June', 'July', 'Aug']
    },
    yAxis: {
        title: {
            text: ''
        },
        labels: {
            format: '{value}k $'
        }
    },
    series: [{
        name: 'Sales',
        data: [206, 216, 247, 330]
    }]
});
