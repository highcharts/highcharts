Highcharts.chart('container', {
    chart: {
        marginLeft: 'max(60px, 6vw)',
        width: 'clamp(320px, 90vw, 760px)'
    },
    title: {
        text: 'Chart size and margin from min(), max() and clamp()'
    },
    subtitle: {
        text: 'Resize the window: width, margin and legend all adapt.'
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
    legend: {
        maxWidth: 'min(300px, 30vw)'
    },
    series: [{
        data: [
            7, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6
        ],
        name: 'Average temperature in Tokyo'
    }, {
        data: [-0.2, 0.8, 5.7, 11.3, 17, 22, 25, 24.2, 20.3, 14.1, 8.6, 3.1],
        name: 'Average temperature in New York'
    }, {
        data: [0.4, 1.4, 4.7, 8.9, 13.8, 16.8, 18.7, 18.3, 14.3, 9.6, 5.2, 1.8],
        name: 'Average temperature in Berlin'
    }]
});
