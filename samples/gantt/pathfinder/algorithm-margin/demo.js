Highcharts.ganttChart('container', {
    title: {
        text: 'Small algorithmMargin'
    },

    xAxis: {
        min: '2014-11-17',
        max: '2014-11-30',
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
            start: '2014-11-18',
            end: '2014-11-25',
            name: 'Start prototype',
            id: 'first'
        }, {
            start: '2014-11-27',
            end: '2014-11-29',
            name: 'Test prototype',
            id: 'second'
        }, {
            start: '2014-11-20',
            end: '2014-11-25',
            name: 'Develop',
            id: 'third',
            dependency: 'first'
        }, {
            start: '2014-11-23',
            end: '2014-11-26',
            name: 'Run acceptance tests',
            id: 'fourth',
            dependency: 'second'
        }]
    }, {
        name: 'Project 2',
        data: [{
            start: '2014-11-18',
            end: '2014-11-19',
            name: 'Create protoype',
            id: 'fifth'
        }, {
            start: '2014-11-19',
            end: '2014-11-23',
            name: 'Write unit tests',
            id: 'sixth',
            dependency: 'fifth'
        }, {
            start: '2014-11-24',
            end: '2014-11-28',
            name: 'Develop',
            id: 'seventh'
        }, {
            start: '2014-11-27',
            end: '2014-11-28',
            name: 'Run user tests',
            id: 'eighth',
            dependency: 'sixth'
        }]
    }]
});
