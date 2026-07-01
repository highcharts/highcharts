QUnit.test('Color axis symbol marker tracks horizontally (#24796)', function (
    assert
) {
    function getPathBBox(path) {
        var xs = [],
            ys = [];

        function addPoint(x, y) {
            if (typeof x === 'number' && typeof y === 'number') {
                xs.push(x);
                ys.push(y);
            }
        }

        path.forEach(function (segment) {
            var command = segment[0],
                i;

            if (command === 'A') {
                if (segment.params) {
                    // Circle symbols use arc radii, not only x/y endpoints.
                    addPoint(
                        segment.params.cx - segment[1],
                        segment.params.cy - segment[2]
                    );
                    addPoint(
                        segment.params.cx + segment[1],
                        segment.params.cy + segment[2]
                    );
                }
                addPoint(segment[6], segment[7]);
                return;
            }

            for (i = 1; i < segment.length - 1; i += 2) {
                if (
                    typeof segment[i] === 'number' &&
                    typeof segment[i + 1] === 'number'
                ) {
                    addPoint(segment[i], segment[i + 1]);
                }
            }
        });

        return {
            x: Math.min.apply(null, xs),
            y: Math.min.apply(null, ys),
            width: Math.max.apply(null, xs) - Math.min.apply(null, xs),
            height: Math.max.apply(null, ys) - Math.min.apply(null, ys)
        };
    }

    var chart = Highcharts.chart('container', {
            chart: {
                type: 'heatmap'
            },

            legend: {
                layout: 'horizontal',
                symbolHeight: 20,
                symbolWidth: 160
            },

            colorAxis: {
                min: 0,
                max: 4,
                marker: {
                    symbol: 'circle'
                }
            },

            series: [
                {
                    data: [
                        [0, 0, 0],
                        [1, 0, 1],
                        [0, 1, 2],
                        [1, 1, 3]
                    ]
                }
            ]
        }),
        colorAxis = chart.colorAxis[0],
        pos1 = colorAxis.left + colorAxis.width * 0.25,
        pos2 = colorAxis.left + colorAxis.width * 0.75,
        box1 = getPathBBox(colorAxis.getPlotLinePath({
            translatedValue: pos1
        })),
        box2 = getPathBBox(colorAxis.getPlotLinePath({
            translatedValue: pos2
        }));

    assert.close(
        box1.width,
        colorAxis.height,
        3,
        'Marker symbol width should use the horizontal color axis height.'
    );

    assert.close(
        box1.height,
        colorAxis.height,
        3,
        'Marker symbol height should use the horizontal color axis height.'
    );

    assert.ok(
        Math.abs(box1.width - colorAxis.width) > 3,
        'Marker symbol width should not use the color axis width.'
    );

    assert.close(
        box1.x + box1.width / 2,
        pos1,
        3,
        'Marker symbol should be horizontally centered on the value.'
    );

    assert.close(
        box1.y,
        colorAxis.top,
        3,
        'Marker symbol should stay at the top of the horizontal color axis.'
    );

    assert.close(
        box2.x - box1.x,
        pos2 - pos1,
        3,
        'Marker symbols should move left-right between values.'
    );

    assert.close(
        box1.y,
        box2.y,
        3,
        'Marker symbols should keep the same vertical position.'
    );
});
