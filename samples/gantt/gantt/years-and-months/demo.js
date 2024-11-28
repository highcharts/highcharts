// THE CHART
Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt Chart with Years and Months'
    },
    xAxis: [{
        tickInterval: 1000 * 60 * 60 * 24 * 30, // Month
        labels: {
            format: '{value:%b}',
            style: {
                fontSize: '8px'
            }
        },
        min: '2014-04-17',
        max: '2015-12-00',
        currentDateIndicator: true
    }, {
        tickInterval: 1000 * 60 * 60 * 24 * 365, // Year
        labels: {
            format: '{value:%Y}',
            style: {
                fontSize: '15px'
            }
        },
        linkedTo: 0
    }],

    series: [{
        name: 'Project 1',
        dataLabels: {
            verticalAlign: 'top',
            inside: false
        },
        data: [{
            name: 'Start prototype',
            start: '2014-05-18',
            end: '2014-12-25'
        }, {
            name: 'Test prototype',
            start: '2015-01-00',
            end: '2015-04-00'
        }, {
            name: 'Develop',
            start: '2015-01-00',
            end: '2015-11-25'
        }, {
            name: 'Run acceptance tests',
            start: '2015-10-23',
            end: '2015-11-26'
        }]
    }]
});
