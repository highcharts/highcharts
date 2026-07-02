const dataTable = new Highcharts.DataTable({
    columns: {
        'Task Name': [
            'Prototyping',
            'Development',
            'Testing',
            'Development',
            'Testing'
        ],
        Start: [
            '2018-12-01',
            '2018-12-02',
            '2018-12-08',
            '2018-12-09',
            '2018-12-10'
        ],
        End: [
            '2018-12-02',
            '2018-12-05',
            '2018-12-09',
            '2018-12-19',
            '2018-12-23'
        ],
        Progress: [
            0.95,
            0.444,
            0.141,
            0.3,
            0
        ]
    }
});

Highcharts.ganttChart('container', {

    title: {
        text: 'Gantt Chart with DataTable'
    },

    yAxis: {
        uniqueNames: true
    },

    dataTable,

    series: [{
        name: 'Project 1',
        dataMapping: {
            name: 'Task Name',
            start: 'Start',
            end: 'End',
            completed: 'Progress'
        }
    }]
});
