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

    chart.series[0].points[1].onMouseOver();

    assert.notEqual(
        chart.tooltip.label.text.element.textContent.indexOf('Milestone'),
        -1,
        'The milestone tooltip should contain the name'
    );
});
