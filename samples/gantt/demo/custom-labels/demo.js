Highcharts.ganttChart('container', {

    title: {
        text: 'Highcharts Gantt Chart'
    },

    subtitle: {
        text: 'With custom symbols in data labels'
    },

    xAxis: {
        minPadding: 0.05,
        maxPadding: 0.05
    },

    yAxis: {
        categories: ['Prototyping', 'Development', 'Testing']
    },

    tooltip: {
        outside: true
    },

    accessibility: {
        point: {
            valueDescriptionFormat: '{point.yCategory}, assigned to {point.assignee} from {point.x:%Y-%m-%d} to {point.x2:%Y-%m-%d}.'
        }
    },

    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
            }
        }
    },

    series: [{
        name: 'Project 1',
        data: [{
            start: Date.UTC(2018, 11, 1),
            end: Date.UTC(2018, 11, 2),
            y: 0,
            assignee: 'bre1470'
        }, {
            start: Date.UTC(2018, 11, 2),
            end: Date.UTC(2018, 11, 5),
            y: 1,
            assignee: 'oysteinmoseng',
            fontSymbol: 'exclamation',
            accessibility: {
                description: 'Exclamation symbol.'
            }
        }, {
            start: Date.UTC(2018, 11, 8),
            end: Date.UTC(2018, 11, 9),
            y: 2,
            assignee: 'TorsteinHonsi'
        }, {
            start: Date.UTC(2018, 11, 9),
            end: Date.UTC(2018, 11, 19),
            y: 1,
            assignee: 'bre1470'
        }, {
            start: Date.UTC(2018, 11, 10),
            end: Date.UTC(2018, 11, 23),
            y: 2,
            assignee: 'TorsteinHonsi',
            fontSymbol: 'smile-o',
            accessibility: {
                description: 'Smiling face symbol.'
            }
        }],
        dataLabels: [{
            enabled: true,
            format: '<div style="width: 20px; height: 20px; overflow: hidden; border-radius: 50%; margin-left: -25px">' +
                '<img src="https://github.com/{point.assignee}.png" ' +
                'style="width: 30px; margin-left: -5px; margin-top: -2px"></div>',
            useHTML: true,
            align: 'left'
        }, {
            enabled: true,
            format: '<i class="fa fa-{point.fontSymbol}" style="font-size: 1.5em"></i>',
            useHTML: true,
            align: 'right'
        }]
    }]
});
