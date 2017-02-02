

QUnit.test('Border width in selected state (#6003)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'pie'
        },

        series: [{
            animation: false,
            data: [{
                y: 1
            }, {
                y: 2
            }, {
                y: 3,
                selected: true
            }],
            states: {
                select: {
                    borderWidth: 5,
                    borderColor: '#000'
                }
            }
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].graphic.element
            .getAttribute('stroke-width'),
        '1',
        'Default stroke width'
    );
    assert.strictEqual(
        chart.series[0].points[2].graphic.element
            .getAttribute('stroke-width'),
        '5',
        'Default stroke width'
    );

});
