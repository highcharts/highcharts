Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '100%'
    },
    title: {
        text: 'Team Dashboard'
    },
    subtitle: {
        text: 'Currently planned work for team'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}'
    },
    plotOptions: {
        packedbubble: {
            minSize: '15%',
            maxSize: '70%',
            layoutAlgorithm: {
                initialPositionRadius: 100,
                splitSeries: true,
                parentNodeLimit: true,
                dragBetweenSeries: true
            },
            dataLabels: {
                enabled: true,
                format: '{point.shortName}',
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'Backlog',
        color: '#003300',
        data: [{
            name: 'Test web page performance',
            shortName: 'Test page',
            value: 5
        }, {
            name: 'Bike trip',
            shortName: 'trip',
            value: 1
        },
        {
            name: "Code-review meeting",
            shortName: 'CR',
            value: 4
        },
        {
            name: "Allow user to change nickname",
            shortName: 'Nickname',
            value: 2
        }]
    }, {
        name: 'To Do',
        color: '#220000',
        data: [{
            name: 'Create newsletter template',
            shortName: 'Newsletter',
            value: 2
        }, {
            name: 'Produce financial raport for Q2',
            shortName: 'Report',
            value: 10
        }, {
            name: 'Meeting with sales team',
            shortName: 'Meeting',
            value: 10
        }]
    }, {
        name: 'In Progress',
        color: '#000022',
        data: [{
            name: 'Develop an android App',
            shortName: 'Development',
            value: 9
        }, {
            name: 'Document the API',
            shortName: 'API',
            value: 7
        }]
    }, {
        name: 'To Verify',
        color: '#bada55',
        data: [{
            name: 'Develop an IOS App',
            shortName: 'Development',
            value: 9
        }, {
            name: 'Change default login page',
            shortName: 'webpage',
            value: 5
        }]
    }, {
        name: 'Done',
        color: '#566550',
        data: [{
            name: 'Strategy meeting with Management',
            shortName: 'Meeting',
            value: 5
        }, {
            name: 'Kanban Packed Bubble migration',
            shortName: 'Migration',
            value: 3
        }]
    }]
});
