const today = new Date(),
    day = 1000 * 60 * 60 * 24;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);

const chartOptions = {
    title: {
        text: 'Highcharts Gantt With Subtasks'
    },
    xAxis: {
        min: today.getTime() - (2 * day),
        max: today.getTime() + (32 * day)
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Planning',
            id: 'planning',
            start: today.getTime(),
            end: today.getTime() + (20 * day)
        }, {
            name: 'Requirements',
            id: 'requirements',
            parent: 'planning',
            start: today.getTime(),
            end: today.getTime() + (5 * day)
        }, {
            name: 'Design',
            id: 'design',
            dependency: 'requirements',
            parent: 'planning',
            start: today.getTime() + (3 * day),
            end: today.getTime() + (20 * day)
        }, {
            name: 'Layout',
            id: 'layout',
            parent: 'design',
            start: today.getTime() + (3 * day),
            end: today.getTime() + (10 * day)
        }, {
            name: 'Graphics',
            parent: 'design',
            dependency: 'layout',
            start: today.getTime() + (10 * day),
            end: today.getTime() + (20 * day)
        }, {
            name: 'Develop',
            id: 'develop',
            start: today.getTime() + (5 * day),
            end: today.getTime() + (30 * day)
        }, {
            name: 'Create unit tests',
            id: 'unit_tests',
            dependency: 'requirements',
            parent: 'develop',
            start: today.getTime() + (5 * day),
            end: today.getTime() + (8 * day)
        }, {
            name: 'Implement',
            id: 'implement',
            dependency: 'unit_tests',
            parent: 'develop',
            start: today.getTime() + (8 * day),
            end: today.getTime() + (30 * day)
        }]
    }]
};

Dashboards.board('container', {
    gui: {
        layouts: [{
            id: 'layout-1',
            rows: [{
                cells: [{
                    id: 'dashboard-col-0'
                }, {
                    id: 'dashboard-col-1'
                }]
            }]
        }]
    },
    components: [{
        cell: 'dashboard-col-0',
        type: 'Highcharts',
        chartConstructor: 'ganttChart',
        chartOptions
    }, {
        cell: 'dashboard-col-1',
        type: 'Highcharts',
        chartConstructor: 'chart',
        chartOptions: {
            series: [{
                data: [1, 2, 3, 4]
            }]
        }
    }]
});
