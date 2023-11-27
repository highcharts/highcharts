const day = 24 * 36e5,
    today = Math.floor(Date.now() / day) * day,
    data = [{
        name: 'New offices',
        id: 'new_offices',
        owner: 'Peter'
    }, {
        name: 'Prepare office building',
        id: 'prepare_building',
        parent: 'new_offices',
        start: today - (2 * day),
        end: today + (6 * day),
        completed: {
            amount: 0.2
        },
        owner: 'Linda'
    }, {
        name: 'Inspect building',
        id: 'inspect_building',
        dependency: 'prepare_building',
        parent: 'new_offices',
        start: today + 6 * day,
        end: today + 8 * day,
        owner: 'Ivy'
    }, {
        name: 'Passed inspection',
        id: 'passed_inspection',
        dependency: 'inspect_building',
        parent: 'new_offices',
        start: today + 9.5 * day,
        milestone: true,
        owner: 'Peter'
    }, {
        name: 'Relocate',
        id: 'relocate',
        dependency: 'passed_inspection',
        parent: 'new_offices',
        owner: 'Josh'
    }, {
        name: 'Relocate staff',
        id: 'relocate_staff',
        parent: 'relocate',
        start: today + 10 * day,
        end: today + 11 * day,
        owner: 'Mark'
    }, {
        name: 'Relocate test facility',
        dependency: 'relocate_staff',
        parent: 'relocate',
        start: today + 11 * day,
        end: today + 13 * day,
        owner: 'Anne'
    }, {
        name: 'Relocate cantina',
        dependency: 'relocate_staff',
        parent: 'relocate',
        start: today + 11 * day,
        end: today + 14 * day,
        owner: 'Berta'
    }];

Highcharts.ganttChart('container', {
    title: {
        text: 'Treegrid with columns study'
    },
    series: [{
        data
    }],
    xAxis: [{}],
    yAxis: {
        grid: {
            columns: [{
                title: {
                    text: 'Primary'
                }
            }, {
                title: {
                    text: 'Secondary'
                },
                labels: {
                    formatter: ctx => data[ctx.value]?.owner || 'NN'
                }
            }]
        }
    }

});
