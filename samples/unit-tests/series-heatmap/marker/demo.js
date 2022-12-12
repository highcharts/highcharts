QUnit.test('General marker tests', function (assert) {
    function resetState(point) {
        point.setState('');
        point.setState('hover');
    }

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'heatmap'
        },

        colorAxis: {
            stops: [
                [0, '#8b0000'],
                [0.5, '#ffffff'],
                [1, '#00008b']
            ]
        },

        series: [
            {
                data: [
                    [0, 0, null],
                    {
                        x: 0,
                        y: 1,
                        value: 1.1,
                        selected: true
                    },
                    [0, 2, 1.2],
                    [1, 0, 2],
                    [1, 1, 2.1],
                    [1, 2, 2.2],
                    [2, 0, 3],
                    [2, 1, 3.1],
                    [2, 2, 3.2]
                ],
                states: {
                    select: {
                        color: 'yellow'
                    }
                }
            }
        ]
    });

    var heatmap = chart.series[0];

    assert.strictEqual(
        heatmap.points[1].graphic.attr('fill'),
        'yellow',
        '#15746: Point should have selected state color'
    );

    // Check setting a series marker's lineWidth and lineColor
    heatmap.update({
        marker: {
            lineWidth: 2,
            lineColor: 'rgba(0, 255, 0, 1)'
        }
    });

    var marker = heatmap.points[0].graphic;

    assert.strictEqual(
        marker.element.getAttribute('stroke'),
        'rgba(0, 255, 0, 1)',
        'Marker\'s line color should set.'
    );

    assert.strictEqual(
        marker.element.getAttribute('stroke-width'),
        '2',
        'Marker\'s line width should set.'
    );

    // Set marker's fixed width and height
    heatmap.update({
        marker: {
            width: 50,
            height: 50
        }
    });

    var bBox = heatmap.points[0].graphic.getBBox();

    assert.strictEqual(
        bBox.width - heatmap.options.marker.lineWidth,
        50,
        'Marker\'s fixed width should set correctly through series.marker options.'
    );

    assert.strictEqual(
        bBox.height - heatmap.options.marker.lineWidth,
        50,
        'Marker\'s fixed height should set correctly through series.marker options.'
    );

    var point = heatmap.points[4];

    point.update({
        marker: {
            width: 20,
            height: 20,
            lineColor: 'red',
            lineWidth: 5
        }
    });

    bBox = point.graphic.getBBox();

    assert.strictEqual(
        bBox.width - point.options.marker.lineWidth,
        20,
        'Marker\'s fixed width lineWidth should set correctly through point.marker.'
    );

    assert.strictEqual(
        bBox.height - point.options.marker.lineWidth,
        20,
        'Marker\'s fixed height lineWidth should set correctly through point.marker.'
    );

    assert.strictEqual(
        point.graphic.attr('stroke'),
        'red',
        'Marker\'s lineWidth color should set correctly through point.marker.'
    );

    // Test marker states
    heatmap.update({
        borderRadius: 5,
        marker: {
            states: {
                hover: {
                    lineColor: 'blue',
                    lineWidth: 10,
                    width: 100,
                    height: 100
                }
            }
        }
    });

    assert.ok(
        heatmap.points[0].graphic.pathArray.length > 5,
        '#15757: Corners should be rounded'
    );

    resetState(point);

    bBox = point.graphic.getBBox();

    assert.strictEqual(
        point.graphic.element.getAttribute('stroke'),
        heatmap.options.marker.states.hover.lineColor,
        'Marker\'s line color should set on hover state.'
    );

    assert.strictEqual(
        parseInt(point.graphic.element.getAttribute('stroke-width'), 10),
        heatmap.options.marker.states.hover.lineWidth,
        'Marker\'s line width should set on hover state.'
    );

    assert.strictEqual(
        bBox.width === 100 && bBox.height === 100,
        true,
        'Marker\'s width and height on hover state are set correctly.'
    );

    heatmap.update({
        marker: {
            states: {
                hover: {
                    lineWidth: void 0,
                    width: void 0,
                    height: void 0,
                    lineWidthPlus: 10,
                    widthPlus: 20,
                    heightPlus: 20
                }
            }
        }
    });

    resetState(point);

    assert.strictEqual(
        parseInt(point.graphic.element.getAttribute('stroke-width'), 10),
        point.options.marker.lineWidth +
            heatmap.options.marker.states.hover.lineWidthPlus,
        'Marker\'s lineWidthPlus value should be applied on hover.'
    );

    bBox = point.graphic.getBBox();

    assert.strictEqual(
        bBox.width,
        point.options.marker.width +
            heatmap.options.marker.states.hover.widthPlus -
            point.options.marker.lineWidth +
            heatmap.options.marker.states.hover.lineWidthPlus,
        'Marker\'s widthPlus value should be applied on hover.'
    );

    assert.strictEqual(
        bBox.height,
        point.options.marker.height +
            heatmap.options.marker.states.hover.heightPlus -
            point.options.marker.lineWidth +
            heatmap.options.marker.states.hover.lineWidthPlus,
        'Marker\'s heightPlus value should be applied on hover.'
    );

    // Testing image as symbol
    heatmap.update({
        marker: {
            symbol:
                'url(data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' x=\'0px\' y=\'0px\' viewBox=\'0 0 41.999 41.999\' style=\'enable-background:new 0 0 41.999 41.999;\' xml:space=\'preserve\'%3E%3Cpath d=\'M36.068,20.176l-29-20C6.761-0.035,6.363-0.057,6.035,0.114C5.706,0.287,5.5,0.627,5.5,0.999v40 c0,0.372,0.206,0.713,0.535,0.886c0.146,0.076,0.306,0.114,0.465,0.114c0.199,0,0.397-0.06,0.568-0.177l29-20 c0.271-0.187,0.432-0.494,0.432-0.823S36.338,20.363,36.068,20.176z\'/%3E%3C/svg%3E)',
            width: 25,
            height: 25
        }
    });

    assert.strictEqual(
        point.graphic.element.tagName === 'image' && point.hasImage,
        true,
        'The image should set as a point\'s marker.'
    );

    assert.ok(
        heatmap.points[0].graphic.hasClass('highcharts-null-point'),
        '#15708: Null points should have null-point class'
    );
});
