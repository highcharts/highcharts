$(function () {
    QUnit.test('Hover color', function (assert) {
        var chart = Highcharts.mapChart('container', {
                series: [{
                    mapData: Highcharts.maps['custom/europe'],
                    data: [
                        ['no', 5],
                        ['fr', 3],
                        ['gb', 2],
                        ['it', null]
                    ],
                    states: {
                        hover: {
                            color: 'red'
                        }
                    }
                }]
            }),
            point1 = chart.series[0].points[0],
            point2 = chart.series[0].points[1];

        Highcharts.fireEvent(point1.graphic.element, 'mouseover');

        assert.strictEqual(
            point1.graphic.element.getAttribute('fill'),
            'red',
            'Point1 has red fill'
        );

        assert.notStrictEqual(
            point2.graphic.element.getAttribute('fill'),
            'red',
            'Point2 does not have red fill'
        );

        Highcharts.fireEvent(point1.graphic.element, 'mouseout');
        Highcharts.fireEvent(point2.graphic.element, 'mouseover');

        assert.strictEqual(
            point2.graphic.element.getAttribute('fill'),
            'red',
            'Point2 has red fill'
        );

        assert.notStrictEqual(
            point1.graphic.element.getAttribute('fill'),
            'red',
            'Point1 does not have red fill'
        );
    });
});
