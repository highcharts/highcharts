Highcharts.ganttChart('container', {

    title: {
        text: 'Gantt Chart with Navigation'
    },

    yAxis: {
        uniqueNames: true
    },

    navigator: {
        enabled: true,
        liveRedraw: true,
        series: {
            type: 'gantt',
            pointPlacement: 0.5,
            pointPadding: 0.25,
            accessibility: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,
            max: 3,
            reversed: true,
            categories: []
        }
    },

    scrollbar: {
        enabled: true
    },

    rangeSelector: {
        enabled: true,
        selected: 0
    },

    accessibility: {
        point: {
            descriptionFormatter: function (point) {
                var completedValue = point.completed ?
                        point.completed.amount || point.completed : null,
                    completed = completedValue ?
                        ' Task ' + Math.round(completedValue * 1000) / 10 + '% completed.' :
                        '';
                return Highcharts.format(
                    '{point.yCategory}.{completed} Start {point.x:%Y-%m-%d}, end {point.x2:%Y-%m-%d}.',
                    { point, completed }
                );
            }
        },
        series: {
            descriptionFormatter: function (series) {
                return series.name;
            }
        }
    },

    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.',
                yAxisDescriptionPlural: 'The chart has one Y axis showing task categories.'
            }
        }
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: Date.UTC(2017, 11, 1),
            end: Date.UTC(2018, 1, 2),
            completed: 0.95,
            name: 'Prototyping'
        }, {
            start: Date.UTC(2018, 1, 2),
            end: Date.UTC(2018, 11, 5),
            completed: 0.5,
            name: 'Development'
        }, {
            start: Date.UTC(2018, 11, 8),
            end: Date.UTC(2018, 11, 9),
            completed: 0.15,
            name: 'Testing'
        }, {
            start: Date.UTC(2018, 11, 9),
            end: Date.UTC(2018, 11, 19),
            completed: {
                amount: 0.3,
                fill: '#fa0'
            },
            name: 'Development'
        }, {
            start: Date.UTC(2018, 11, 10),
            end: Date.UTC(2018, 11, 23),
            name: 'Testing'
        }, {
            start: Date.UTC(2018, 11, 25, 8),
            end: Date.UTC(2018, 11, 25, 16),
            name: 'Release'
        }]
    }]
});
