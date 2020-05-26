QUnit.test('Point should have focus border when focused', function (assert) {
    const focusBorderColor = '#ff0000';
    const chart = Highcharts.chart('container', {
            accessibility: {
                keyboardNavigation: {
                    focusBorder: {
                        style: {
                            color: focusBorderColor
                        }
                    }
                }
            },
            series: [{
                data: [1, 2, 3]
            }]
        }),
        point = chart.series[0].points[0];

    point.highlight();

    const focusedGraphic = chart.focusElement;

    assert.strictEqual(
        focusedGraphic,
        point.graphic,
        'Focused graphic should equal the point graphic'
    );

    assert.strictEqual(
        focusedGraphic.focusBorder.attr('stroke'),
        focusBorderColor,
        'Focused graphic should have a border element with correct stroke'
    );
});

QUnit.test('Updating point should update focus border', function (assert) {
    const chart = Highcharts.chart('container', {
            series: [{
                data: [1, 2, 3]
            }]
        }),
        point = chart.series[0].points[0];

    point.highlight();

    const initialPosition = chart.focusElement.focusBorder.element.getBBox().y;

    point.update(10);

    const newPosition = chart.focusElement.focusBorder.element.getBBox().y;

    assert.notStrictEqual(
        initialPosition,
        newPosition,
        'Focus border should have moved'
    );
});