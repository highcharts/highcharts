Highcharts.chart('container', {

    title: {
        text: 'Format subexpressions'
    },

    subtitle: {
        text: 'Conversion from Celsius to Fahrenheit'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        title: {
            text: 'Degrees Celsius'
        }
    },

    plotOptions: {
        series: {
            dataLabels: [{
                enabled: true,
                format: '{(add (multiply y (divide 9 5)) 32):.1f}℉',
                style: {
                    fontWeight: 'normal'
                }
            }, {
                enabled: true,
                verticalAlign: 'top',
                format: '{y}℃',
                style: {
                    fontWeight: 'normal'
                }
            }]
        }
    },

    series: [{
        name: 'Temperature',
        type: 'spline',
        data: [-13.6, -14.9, -5.8, -0.7, 3.1, 13.0, 14.5, 10.8, 5.8,
            -0.7, -11.0, -16.4],
        tooltip: {
            valueSuffix: '°C'
        }
    }]
});