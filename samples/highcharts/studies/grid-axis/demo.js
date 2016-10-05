console.clear();
$(function () {

    // THE CHART
    Highcharts.chart('container', {
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
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}'
            },
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        }, {
            grid: true,
            categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
            min: 0,
            max: 12
        }, {
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
            linkedTo: 0
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
        }, {
            grid: true,
            tickInterval: 1,
            min: 0
        }],
        yAxis: [{
            title: '',
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true,
            opposite: true,
            grid: true
        }, {
            title: '',
            grid: true,
            reversed: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '2em'
                }
            },
            min: Date.UTC(2014, 10, 18),
            max: Date.UTC(2014, 10, 21)
        }, {
            title: '',
            id: 'thisGuy',
            grid: true,
            reversed: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            min: Date.UTC(2014, 10, 18),
            max: Date.UTC(2014, 10, 21)
        }],
        series: [{
            name: 'Project 1',
            borderRadius: 10,
            xAxis: 0,
            data: [{
                x: Date.UTC(2014, 10, 18),
                x2: Date.UTC(2014, 10, 25),
                y: 0
            }, {
                x: Date.UTC(2014, 10, 20),
                x2: Date.UTC(2014, 10, 25),
                y: 1
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
            xAxis: 0,
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
        }, {
            name: 'Project 3',
            borderRadius: 10,
            xAxis: 1,
            yAxis: 2,
            data: [{
                x: 7,
                x2: 9,
                y: Date.UTC(2014, 10, 19)
            }, {
                x: 7,
                x2: 12,
                y: Date.UTC(2014, 10, 20)
            }, {
                x: 12,
                x2: 13,
                y: Date.UTC(2014, 10, 21)
            }]
        }, {
            name: 'Project 4',
            borderRadius: 10,
            xAxis: 4,
            data: [{
                x: 1,
                x2: 2,
                y: 1
            }, {
                x: 3,
                x2: 4,
                y: 2
            }]
        }]
    });
});
