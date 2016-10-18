$(function () {

    // THE CHART
    $('#container').highcharts({
        chart: {
            type: 'xrange',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Highcharts GridAxis'
        },
        xAxis: [{
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1.5em'
                }
            },
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        }, {
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            labels: {
                format: '{value:Week %W}',
                style: {
                    fontSize: '1.5em'
                }
            },
            linkedTo: 0
        }],
        yAxis: [{
            title: '',
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true,
            grid: true
        }],
        series: [{
            name: 'Project 1',
            borderRadius: 10,
            data: [{
                x: Date.UTC(2014, 10, 18),
                x2: Date.UTC(2014, 10, 25),
                y: 0,
                partialFill: 0.25
            }, {
                x: Date.UTC(2014, 10, 20),
                x2: Date.UTC(2014, 10, 25),
                y: 1,
                partialFill: {
                    amount: 0.12,
                    fill: '#fa0'
                }
            }, {
                x: Date.UTC(2014, 10, 26),
                x2: Date.UTC(2014, 10, 28),
                y: 0
            }, {
                x: Date.UTC(2014, 10, 23),
                x2: Date.UTC(2014, 10, 26),
                y: 2
            }]
        }, {
            name: 'Project 2',
            borderRadius: 10,
            visible: false,
            data: [{
                x: Date.UTC(2014, 10, 24),
                x2: Date.UTC(2014, 10, 27),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 27),
                x2: Date.UTC(2014, 10, 28),
                y: 2
            }, {
                x: Date.UTC(2014, 10, 27),
                x2: Date.UTC(2014, 10, 28),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 18),
                x2: Date.UTC(2014, 10, 19),
                y: 2
            }]
        }]
    });
});
