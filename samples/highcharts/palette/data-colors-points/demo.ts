Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>palette</em> options'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    palette: {
        colorScheme: 'light dark',
        dark: {
            colors: ['#2caffe', '#00e272', '#efdf00']
        },
        light: {
            colors: ['#2caffe', '#544fc5', '#00e272']
        }
    },
    plotOptions: {
        column: {
            colorByPoint: true
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});
