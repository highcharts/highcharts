var today = new Date(),
    day = 1000 * 60 * 60 * 24;

// Set to 00:00:00:000 today
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

// THE CHART
Highcharts.ganttChart('container', {
    title: {
        text: 'Gantt Chart Test'
    },
    xAxis: {
        currentDateIndicator: true,
        min: today - 3 * day,
        max: today + 18 * day
    },

    /*
    plotOptions: {
        gantt: {
            pathfinder: {
                type: 'simpleConnect'
            }
        }
    },
    */

    series: [{
        name: 'Offices',
        data: [{
            name: 'New offices',
            id: 'new_offices'
        }, {
            name: 'Prepare office building',
            id: 'prepare_building',
            parent: 'new_offices',
            start: today - (2 * day),
            end: today + (6 * day),
            completed: {
                amount: 0.2
            }
        }, {
            name: 'Inspect building',
            id: 'inspect_building',
            dependency: 'prepare_building',
            parent: 'new_offices',
            start: today + 6 * day,
            end: today + 8 * day
        }, {
            name: 'Passed inspection',
            id: 'passed_inspection',
            dependency: 'inspect_building',
            parent: 'new_offices',
            start: today + 9.5 * day,
            milestone: true
        }, {
            name: 'Relocate',
            id: 'relocate',
            dependency: 'passed_inspection',
            parent: 'new_offices'
        }, {
            name: 'Relocate staff',
            id: 'relocate_staff',
            parent: 'relocate',
            start: today + 10 * day,
            end: today + 11 * day
        }, {
            name: 'Relocate test facility',
            dependency: 'relocate_staff',
            parent: 'relocate',
            start: today + 11 * day,
            end: today + 13 * day
        }, {
            name: 'Relocate cantina',
            dependency: 'relocate_staff',
            parent: 'relocate',
            start: today + 11 * day,
            end: today + 14 * day
        }]
    }, {
        name: 'Product',
        data: [{
            name: 'New product launch',
            id: 'new_product'
        }, {
            name: 'Development',
            id: 'development',
            parent: 'new_product',
            start: today - day,
            end: today + (11 * day),
            completed: {
                amount: 0.6,
                fill: '#e80'
            }
        }, {
            name: 'Beta',
            id: 'beta',
            dependency: 'development',
            parent: 'new_product',
            start: today + 12.5 * day,
            milestone: true
        }, {
            name: 'Final development',
            id: 'finalize',
            dependency: 'beta',
            parent: 'new_product',
            start: today + 13 * day,
            end: today + 17 * day
        }, {
            name: 'Launch',
            dependency: 'finalize',
            parent: 'new_product',
            start: today + 17.5 * day,
            milestone: true
        }]
    }]
});
