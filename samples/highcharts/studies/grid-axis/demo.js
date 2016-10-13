$(function () {

    // THE CHART
    $('#container').highcharts({
        chart: {
            type: 'scatter',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Highcharts GridAxis'
        },
        xAxis: [{
            id: 'bottom-datetime-axis',
            grid: true,
            type: 'datetime',
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}'
            },
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        }, {
            id: 'bottom-linear-axis',
            grid: true,
            tickInterval: 1,
            tickPixelInterval: 45,
            min: 1,
            max: 13
        }, {
            id: 'bottom-categories-axis',
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
                y: 0
            }, {
                x: Date.UTC(2014, 10, 20),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 26),
                y: 0
            }, {
                x: Date.UTC(2014, 10, 23),
                y: 2
            }]
        }, {
            name: 'Project 2',
            borderRadius: 10,
            visible: false,
            xAxis: 0,
            data: [{
                x: Date.UTC(2014, 10, 24),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 27),
                y: 2
            }, {
                x: Date.UTC(2014, 10, 27),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 18),
                y: 2
            }]
        }, {
            name: 'Project 3',
            borderRadius: 10,
            xAxis: 2,
            yAxis: 2,
            data: [{
                x: 7,
                y: Date.UTC(2014, 10, 19)
            }, {
                x: 7,
                y: Date.UTC(2014, 10, 20)
            }, {
                x: 12,
                y: Date.UTC(2014, 10, 21)
            }]
        }, {
            name: 'Project 4',
            borderRadius: 10,
            xAxis: 1,
            data: [{
                x: 1,
                y: 1
            }, {
                x: 3,
                y: 2
            }]
        }]
    });
});
