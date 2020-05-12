Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    accessibility: {
        point: {
            descriptionFormatter: function (p) {
                return p.series.name + ', ' + p.category + ', ' + p.y + '°F.';
            }
        }
    },
    title: {
        text: 'Monthly Average Temperature'
    },
    subtitle: {
        text: 'Source: WorldClimate.com'
    },
    xAxis: {
        categories: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Temperature (°F)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 10px">{point.key} average temperature</span><br/>',
        valueSuffix: '°F'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'New York',
        data: [30.7, 31.5, 39, 49.8, 60.8, 70.2, 75.6, 73.8, 66.9, 55.9, 44.8, 34.5]
    }, {
        name: 'Canberra',
        data: [68.4, 67.8, 63.5, 55.8, 48.4, 43.5, 41.5, 44.2, 48.7, 54.5, 59.7, 64.9]
    }, {
        name: 'Ottawa',
        data: [12.2, 13.8, 25.5, 41.2, 55.0, 64.8, 69.1, 66.7, 58.5, 46.6, 33.3, 17.8]
    }, {
        name: 'Dubai',
        data: [65.5, 67.1, 72.1, 79.2, 86.7, 90.1, 95.0, 95.0, 90.5, 84.2, 76.3, 68.7]
    }]
});