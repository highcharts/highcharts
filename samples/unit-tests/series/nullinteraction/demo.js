QUnit.test('Null interaction should allow tooltip for null points', assert => {
    const chart = Highcharts.chart('container', {
            tooltip: {
                nullFormat: '<span>null</span>',
                shared: true
            },
            series: [{
                data: [null],
                nullInteraction: true
            }, {
                data: [1],
                nullInteraction: true
            }]
        }),
        tt = chart.tooltip,
        p1 = chart.series[0].points[0],
        p2 = chart.series[1].points[0],
        includesNullStr = (
            strToCheck = tt.label.text.textStr
        ) => strToCheck.includes('null');

    tt.refresh([p1, p2]);

    assert.strictEqual(
        includesNullStr(),
        true,
        'Normal tooltip should highlight null point'
    );

    tt.update({ shared: false });
    tt.refresh(p1);

    assert.strictEqual(
        includesNullStr(),
        true,
        'Shared tooltip should highlight null point'
    );

    tt.update({ split: true });
    tt.refresh([p1, p2]);

    assert.strictEqual(
        includesNullStr(tt.label.element.textContent),
        true,
        'Split tooltip should highlight null point'
    );
});
