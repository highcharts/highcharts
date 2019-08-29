QUnit.test('Exporting region has ARIA markup', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3, 4, 5, 6]
            }],
            yAxis: {
                plotBands: [{
                    from: 0,
                    to: 1,
                    color: 'red'
                }]
            }
        }),
        exportGroup = chart.accessibility.components.chartMenu.exportProxyGroup;

    assert.ok(
        exportGroup.getAttribute('aria-label'),
        'There is aria label on the exporting group'
    );
    assert.ok(
        exportGroup.firstChild.getAttribute('aria-label'),
        'There is aria label on the exporting group child'
    );
});
