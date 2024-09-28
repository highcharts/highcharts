QUnit.test('Hover color', function (assert) {
    // Cache names from Boost module
    const colorNames = Highcharts.Color.names;
    Highcharts.Color.names = {};

    const chart = Highcharts.mapChart('container', {
            mapNavigation: {
                enabled: true
            },
            colorAxis: {
                enabled: true,
                dataClasses: [{
                    to: 3
                }, {
                    from: 3,
                    to: 5
                }]
            },
            series: [
                {
                    allowPointSelect: true,
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
                }
            ]
        }),
        point1 = chart.series[0].points[0],
        point2 = chart.series[0].points[1],
        { fireEvent } = Highcharts;

    fireEvent(point1.graphic.element, 'mouseover');

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

    fireEvent(point1.graphic.element, 'mouseout');
    fireEvent(point2.graphic.element, 'mouseover');

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

    // Reset
    Highcharts.Color.names = colorNames;

    point1.firePointEvent('click');
    chart.mapView.zoomBy(1);

    assert.strictEqual(
        point1.selected,
        true,
        'Point should be selected after zooming/panning the chart (#19175).'
    );

    fireEvent(chart.legend.allItems[1].legendItem.group.element, 'click');
    chart.mapView.zoomBy(-1);

    assert.strictEqual(
        point2.visible,
        false,
        `After disabling the data class visibility and doing some map
        interaction, the point belonging to that data class should not be
        visible (#20441).`
    );
});
