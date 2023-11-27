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

const options = {
    title: {
        text: 'Tree grid with columns'
    },
    series: [{
        data,
        dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
                fontWeight: 'normal',
                textOutline: 'none'
            }
        }
    }],
    xAxis: [{
        custom: {
            weekendPlotBands: true
        }
    }, {}],
    yAxis: {
        grid: {
            borderColor: 'rgba(128,128,128,0.2)',
            columns: [{
                title: {
                    text: 'Task'
                },
                categories: ['Prepare', 'Execute']
            }, {
                title: {
                    text: 'Owner'
                },
                labels: {
                    formatter: ctx => data[ctx.value]?.owner || 'NN'
                }
            }]
        }
    }

};


// Plug-in to render plot bands for the weekends
Highcharts.addEvent(Highcharts.Axis, 'foundExtremes', e => {
    if (e.target.options.custom && e.target.options.custom.weekendPlotBands) {
        const axis = e.target,
            chart = axis.chart,
            day = 24 * 36e5,
            isWeekend = t => /[06]/.test(chart.time.dateFormat('%w', t)),
            plotBands = [];

        let inWeekend = false;

        for (
            let x = Math.floor(axis.min / day) * day;
            x <= Math.ceil(axis.max / day) * day;
            x += day
        ) {
            const last = plotBands.at(-1);
            if (isWeekend(x) && !inWeekend) {
                plotBands.push({
                    from: x,
                    color: 'rgba(128,128,128,0.05)'
                });
                inWeekend = true;
            }

            if (!isWeekend(x) && inWeekend && last) {
                last.to = x;
                inWeekend = false;
            }
        }
        axis.options.plotBands = plotBands;
    }
});

Highcharts.ganttChart('container', options);
