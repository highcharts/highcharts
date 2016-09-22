QUnit.test('pointFormat', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'treemap',
                data: [{
                    name: 'Peter',
                    value: 2
                }]
            }]
        }),
        series = chart.series[0],
        point = series.points[0],
        pointFormat = series.tooltipOptions.pointFormat;
    assert.strictEqual(
        pointFormat,
        '<b>{point.name}</b>: {point.value}</b><br/>',
        'pointFormat'
    );
    assert.strictEqual(
        point.tooltipFormatter(pointFormat),
        '<b>Peter</b>: 2</b><br/>',
        'tooltipFormat by default'
    );
    series.update({
        tooltip: {
            valueSuffix: 'X'
        }
    });
    point = series.points[0];
    assert.strictEqual(
        point.tooltipFormatter(pointFormat),
        '<b>Peter</b>: 2X</b><br/>',
        'tooltipFormat with valueSuffix'
    );
    series.update({
        tooltip: {
            valueSuffix: '',
            valuePrefix: 'X'
        }
    });
    point = series.points[0];
    assert.strictEqual(
        point.tooltipFormatter(pointFormat),
        '<b>Peter</b>: X2</b><br/>',
        'tooltipFormat with valuePrefix'
    );
    series.update({
        tooltip: {
            valueSuffix: '',
            valuePrefix: '',
            valueDecimals: 2
        }
    });
    point = series.points[0];
    assert.strictEqual(
        point.tooltipFormatter(pointFormat),
        '<b>Peter</b>: 2.00</b><br/>',
        'tooltipFormat with valueDecimals'
    );
    series.update({
        tooltip: {
            valueSuffix: 'X',
            valuePrefix: 'X',
            valueDecimals: 2
        }
    });
    point = series.points[0];
    assert.strictEqual(
        point.tooltipFormatter(pointFormat),
        '<b>Peter</b>: X2.00X</b><br/>',
        'tooltipFormat with valuePrefix, valueSuffix and valueDecimals'
    );
});
