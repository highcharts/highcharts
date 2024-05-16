Highcharts.Templating.helpers.sum = function () {
    return this.series.chart.series[0].points.reduce(
        (sum, point) => sum + point.y, 0
    );
};

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Daily Steps Count'
    },
    xAxis: {
        categories: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
            'Saturday', 'Sunday'
        ],
        accessibility: {
            description: 'Day of the week'
        }
    },
    yAxis: {
        title: {
            text: 'Steps'
        }
    },
    series: [{
        name: 'Emma',
        data: [9438, 4201, 10023, 9204, 10392, 7201, 8039],
        color: '#3A3691',
        dataLabels: {
            enabled: true
        }
    }, {
        type: 'xrange',
        showInLegend: false,
        accessibility: {
            exposeAsGroupOnly: true,
            descriptionFormat: 'Emma did not reach her step goal which was ' +
                '70000 steps in one week. She walked {sum} steps.'
        },
        name: 'Total step count',
        color: '#009AFA',
        data: [{
            x: 0,
            x2: 6,
            y: 17000,
            partialFill: 0.83
        }],
        tooltip: {
            headerFormat: void 0,
            pointFormat: '<b>Steps walked this week:</b> {sum}/70000'
        },
        dataLabels: {
            color: '#ffffff',
            enabled: true,
            format: '{sum} / 70000 steps this week.',
            verticalAlign: 'top',
            style: {
                fontSize: '12px',
                fontWeight: 'bold'
            }
        }
    }]
});
