
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
        exportGroup = chart.exportingGroup;

    assert.ok(
        exportGroup.element.getAttribute('aria-label'),
        'There is aria label on the exporting group'
    );
    assert.ok(
        exportGroup.element.firstChild.getAttribute('aria-label'),
        'There is aria label on the exporting group child'
    );
    assert.ok(
        parseFloat(exportGroup.element.getAttribute('data-z-index')) >
        parseFloat(
            chart.yAxis[0].plotLinesAndBands[0].svgElem
                .parentGroup.element.getAttribute('data-z-index')
        ),
        'Z index of export group is above plot bands'
    );

    chart.update({
        yAxis: {
            plotBands: [{
                from: 1,
                to: 2,
                color: 'red'
            }]
        }
    });

    assert.ok(
        parseFloat(exportGroup.element.getAttribute('data-z-index')) >
        parseFloat(
            chart.yAxis[0].plotLinesAndBands[0].svgElem
                .parentGroup.element.getAttribute('data-z-index')
        ),
        'Z index of export group is above plot bands after update'
    );
});
