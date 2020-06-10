QUnit.test("Series.opacity general tests", assert => {
    const chart = Highcharts.chart('container', {
        series: [{
            opacity: 0,
            data: [1, 2]
        }, {
            opacity: 1,
            data: [1, 1]
        }, {
            opacity: 0.5,
            data: [2, 2]
        }]
    });

    assert.strictEqual(
        chart.series[0].group.attr('opacity'),
        0,
        'Initial opacity=0 should be applied for a group'
    );

    assert.strictEqual(
        chart.series[1].group.attr('opacity'),
        1,
        'Initial opacity=1 should be applied for a group'
    );

    assert.strictEqual(
        chart.series[2].group.attr('opacity'),
        0.5,
        'Initial opacity=0.5 should be applied for a group'
    );

    chart.series[0].update({ opacity: 1 });
    assert.strictEqual(
        chart.series[0].group.attr('opacity'),
        1,
        'Updating series.opacity from 0 to 1 should be applied for a group'
    );

    chart.series[1].update({ opacity: 0 });
    assert.strictEqual(
        chart.series[1].group.attr('opacity'),
        0,
        'Updating series.opacity from 1 to 0 should be applied for a group'
    );

});
