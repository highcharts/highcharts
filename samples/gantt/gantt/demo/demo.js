$(function () {

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
                taskName: 'New offices',
                id: 'new_offices',
                start: today - 2 * day,
                end: today + 14 * day,
                y: 0
            }, {
                taskName: 'Prepare office building',
                id: 'prepare_building',
                parent: 'new_offices',
                start: today - (2 * day),
                end: today + (6 * day),
                y: 1,
                completed: {
                    amount: 0.2
                }
            }, {
                taskName: 'Inspect building',
                id: 'inspect_building',
                dependency: 'prepare_building',
                parent: 'new_offices',
                start: today + 6 * day,
                end: today + 8 * day,
                y: 2
            }, {
                taskName: 'Passed inspection',
                id: 'passed_inspection',
                dependency: 'inspect_building',
                parent: 'new_offices',
                start: today + 9.5 * day,
                milestone: true,
                y: 3
            }, {
                taskName: 'Relocate',
                id: 'relocate',
                dependency: 'passed_inspection',
                parent: 'new_offices',
                start: today + 10 * day,
                end: today + 14 * day,
                y: 4
            }, {
                taskName: 'Relocate staff',
                id: 'relocate_staff',
                parent: 'relocate',
                start: today + 10 * day,
                end: today + 11 * day,
                y: 5
            }, {
                taskName: 'Relocate test facility',
                dependency: 'relocate_staff',
                parent: 'relocate',
                start: today + 11 * day,
                end: today + 13 * day,
                y: 6
            }, {
                taskName: 'Relocate cantina',
                dependency: 'relocate_staff',
                parent: 'relocate',
                start: today + 11 * day,
                end: today + 14 * day,
                y: 7
            }]
        }, {
            name: 'Product',
            data: [{
                taskName: 'New product launch',
                id: 'new_product',
                start: today - day,
                end: today + 18 * day,
                y: 8
            }, {
                taskName: 'Development',
                id: 'development',
                parent: 'new_product',
                start: today - day,
                end: today + (11 * day),
                y: 9,
                completed: {
                    amount: 0.6,
                    fill: '#e80'
                }
            }, {
                taskName: 'Beta',
                id: 'beta',
                dependency: 'development',
                parent: 'new_product',
                start: today + 12.5 * day,
                milestone: true,
                y: 10
            }, {
                taskName: 'Final development',
                id: 'finalize',
                dependency: 'beta',
                parent: 'new_product',
                start: today + 13 * day,
                end: today + 17 * day,
                y: 11
            }, {
                taskName: 'Launch',
                dependency: 'finalize',
                parent: 'new_product',
                start: today + 17.5 * day,
                milestone: true,
                y: 12
            }]
        }]
    });
});
