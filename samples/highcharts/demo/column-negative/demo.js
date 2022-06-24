// Data retrieved from https://www.yr.no/nb
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Average temperature, 2021'
    },
    xAxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
    },
    yAxis: {
        title: {
            text: 'Temperature °C'
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Oslo',
        data: [
            -5.0, -3.6, 3.3, 5.8, 10.6, 17.3, 20.0, 16.5, 13.4, 9.1, 2.9, -3.1]
    }, {
        name: 'Svalbard',
        data: [-8.5, -7.8, -10.8, -6.8, -4.0, 3.7, 6.7, 6.4, 3.5, -3.7,
            -10.6, -7.7]
    }, {
        name: 'Trondheim',
        data: [-6.2, -4.6, 1.7, 2.3, 8.1, 13.2, 16.3, 12.1, 9.9, 7.0, 0.5, -2.9]
    }]
});
