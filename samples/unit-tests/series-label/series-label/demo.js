QUnit.test('Series label', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 400
        },
        series: [{
            data: [1, 3, 2, 4],
            label: {
                enabled: true
            }
        }, {
            data: [1, 3, 2, 4],
            label: {
                format: 'Format {name}',
                formatter: function () {
                    return 'Formatter ' + this.name;
                }
            }
        }, {
            data: [1, 3, 2, 4],
            label: {
                formatter: function () {
                    return 'Formatter ' + this.name;
                }
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].labelBySeries.text.textStr,
        'Series 1',
        'Default series label should be series name'
    );

    assert.strictEqual(
        chart.series[1].labelBySeries.text.textStr,
        'Format Series 2',
        'Series label with format should take precedence'
    );

    assert.strictEqual(
        chart.series[2].labelBySeries.text.textStr,
        'Formatter Series 3',
        'Series label with formatter'
    );
});
