QUnit.test('yAxis theme settings affected color axis (#5569)', function (assert) {

    var gridLineColor = Highcharts.Axis.prototype.defaultYAxisOptions.gridLineColor;

    Highcharts.theme = {
        yAxis: {
            alternateGridColor: '#ff0',
            gridLineColor: 'red'
        }
    };
    Highcharts.setOptions(Highcharts.theme);

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap',
            margin: [60, 10, 80, 50]
        },
        yAxis: {
            tickPositions: [0, 6, 12, 18, 24, 30, 36, 42],
            min: 0,
            max: 42
        },
        colorAxis: {
            min: -15,
            max: 25
        },
        series: [{
            data: [
                [1, 1, 1],
                [2, 2, 2]
            ]
        }]
    });

    assert.strictEqual(
        chart.colorAxis[0].options.alternateGridColor,
        undefined,
        'No bleed'
    );

    assert.notEqual(
        chart.colorAxis[0].options.gridLineColor,
        chart.yAxis[0].options.gridLineColor,
        'No bleed'
    );

    // Undo
    Highcharts.setOptions({
        yAxis: {
            alternateGridColor: null,
            gridLineColor: gridLineColor
        }
    });
});
