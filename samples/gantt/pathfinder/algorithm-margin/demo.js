Highcharts.ganttChart('container', {
    title: {
        text: 'Small algorithmMargin'
    },

    xAxis: {
        min: Date.UTC(2014, 10, 17),
        max: Date.UTC(2014, 10, 30),
        currentDateIndicator: true
    },

    plotOptions: {
        series: {
            colorByPoint: false,
            connectors: {
                algorithmMargin: 2,
                startMarker: {
                    symbol: 'square',
                    radius: 3
                }
            }
        }
    },

    legend: {
        enabled: true
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 25),
            name: 'Start prototype',
            id: 'first'
        }, {
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 29),
            name: 'Test prototype',
            id: 'second'
        }, {
            start: Date.UTC(2014, 10, 20),
            end: Date.UTC(2014, 10, 25),
            name: 'Develop',
            id: 'third',
            dependency: 'first'
        }, {
            start: Date.UTC(2014, 10, 23),
            end: Date.UTC(2014, 10, 26),
            name: 'Run acceptance tests',
            id: 'fourth',
            dependency: 'second'
        }]
    }, {
        name: 'Project 2',
        data: [{
            start: Date.UTC(2014, 10, 18),
            end: Date.UTC(2014, 10, 19),
            name: 'Create protoype',
            id: 'fifth'
        }, {
            start: Date.UTC(2014, 10, 19),
            end: Date.UTC(2014, 10, 23),
            name: 'Write unit tests',
            id: 'sixth',
            dependency: 'fifth'
        }, {
            start: Date.UTC(2014, 10, 24),
            end: Date.UTC(2014, 10, 28),
            name: 'Develop',
            id: 'seventh'
        }, {
            start: Date.UTC(2014, 10, 27),
            end: Date.UTC(2014, 10, 28),
            name: 'Run user tests',
            id: 'eighth',
            dependency: 'sixth'
        }]
    }]
});
