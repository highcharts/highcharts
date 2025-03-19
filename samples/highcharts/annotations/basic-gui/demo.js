Highcharts.chart('container', {
    navigation: {
        // informs Annotations module where to look for HTML elements for adding
        // annotations etc.
        bindingsClassName: 'custom-gui-container'
    },
    chart: {
        type: 'line'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        title: {
            text: 'Temperature (°C)'
        }
    },
    series: [{
        name: 'Reggane',
        data: [
            16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2,
            22.0, 17.8
        ]
    }, {
        name: 'Tallinn',
        data: [
            -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5,
            2.0, -0.9
        ]
    }]
});