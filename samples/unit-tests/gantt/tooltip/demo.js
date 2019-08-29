QUnit.test('Gantt tooltip', assert => {
    const chart = Highcharts.ganttChart('container', {
        series: [{
            data: [{
                start: Date.UTC(2019, 0, 1),
                end: Date.UTC(2019, 0, 7),
                name: 'Task'
            }, {
                start: Date.UTC(2019, 0, 5),
                milestone: true,
                name: 'Milestone'
            }]
        }]
    });

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'Series 1TaskStart: Tuesday, Jan  1, 2019End: Monday, Jan  7, 2019',
        'All times on midnight - tooltip should show the date without time'
    );

    chart.series[0].points[1].onMouseOver();

    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'Series 1MilestoneSaturday, Jan  5, 2019',
        'All times on midnight - tooltip should show the date without time'
    );

    // Test with intraday times
    chart.series[0].update({
        data: [{
            start: Date.UTC(2019, 0, 1, 8),
            end: Date.UTC(2019, 0, 7, 16),
            name: 'Task'
        }, {
            start: Date.UTC(2019, 0, 5, 12),
            milestone: true,
            name: 'Milestone'
        }]
    });

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'Series 1TaskStart: Tuesday, Jan  1, 08:00End: Monday, Jan  7, 16:00',
        'Intraday times - tooltip should show the date and time of day'
    );

    chart.series[0].points[1].onMouseOver();

    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'Series 1MilestoneSaturday, Jan  5, 12:00',
        'Intraday times - tooltip should show the date and time of day'
    );
});
