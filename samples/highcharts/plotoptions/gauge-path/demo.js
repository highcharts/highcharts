Highcharts.chart('container', {
    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Custom dial path'
    },

    pane: {
        startAngle: -120,
        endAngle: 120,
        innerSize: 160,
        borderRadius: '50%',
        background: {
            backgroundColor: 'green'
        },
        size: 180
    },

    yAxis: {
        min: 0,
        max: 100
    },

    series: [{
        data: [75],
        dial: {
            path: [
                ['M', 78, 0],
                ['a', 6, 6, 0, 1, 1, 12, 12],
                ['a', 6, 6, 0, 1, 1, -12, -12]
            ],
            backgroundColor: 'white',
            borderColor: 'green',
            borderWidth: 5
        },
        pivot: {
            radius: 0
        },
        dataLabels: {
            verticalAlign: 'middle',
            y: 0
        }
    }]
});
