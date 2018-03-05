
/* Unit tests for pattern-fill module */

QUnit.test('SVGRenderer used directly', function (assert) {
    var doc = Highcharts.win.document,
        renderer = new Highcharts.Renderer(
            doc.getElementById('container'),
            400,
            400
        ),
        circle = renderer.circle({
            fill: {
                pattern: {
                    id: 'custom-id',
                    path: {
                        d: 'M 3 3 L 8 3 L 8 8 Z',
                        fill: '#00ff00'
                    },
                    width: 12,
                    height: 12,
                    color: '#ff0000',
                    opacity: 0.5
                }
            },
            x: 40,
            y: 40,
            r: 10
        }).add(),
        pattern = doc.getElementById('custom-id');

    assert.strictEqual(
        renderer.defs.element.firstChild,
        pattern,
        'Pattern is in defs'
    );

    assert.strictEqual(
        pattern.getElementsByTagName('path')[0].getAttribute('stroke'),
        '#ff0000',
        'Pattern has path with correct color'
    );

    assert.strictEqual(
        pattern.getElementsByTagName('rect')[0].getAttribute('fill'),
        '#00ff00',
        'Pattern has rect with correct color'
    );

    assert.strictEqual(
        circle.element.getAttribute('fill'),
        'url(#custom-id)',
        'Circle has pattern ref as fill'
    );
});


QUnit.test('Pattern fill set on series', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'column',
                keys: ['y', 'color'],
                color: {
                    pattern: {
                        id: 'custom-id',
                        path: {
                            d: 'M 3 3 L 8 3 L 8 8 Z',
                            fill: '#000000'
                        },
                        width: 12,
                        height: 12,
                        color: '#ff0000',
                        opacity: 0.5
                    }
                },
                data: [
                    [1, 'url(#highcharts-default-pattern-0)'],
                    2,
                    3
                ]
            }]
        }),
        points = chart.series[0].points,
        doc = Highcharts.win.document,
        firstPattern = doc.getElementById('highcharts-default-pattern-0'),
        secondPattern = doc.getElementById('custom-id');

    assert.strictEqual(
        firstPattern.tagName.toLowerCase(),
        'pattern',
        'First pattern exists'
    );

    assert.strictEqual(
        secondPattern.tagName.toLowerCase(),
        'pattern',
        'Second pattern exists'
    );

    assert.strictEqual(
        points[0].graphic.element.getAttribute('fill'),
        'url(#highcharts-default-pattern-0)',
        'First point has pattern link as color'
    );

    assert.strictEqual(
        firstPattern.firstChild.getAttribute('stroke'),
        Highcharts.getOptions().colors[0],
        'First pattern has same color as first color in colors array'
    );

    assert.strictEqual(
        points[1].graphic.element.getAttribute('fill'),
        'url(#custom-id)',
        'Second point has pattern link as color'
    );

    assert.strictEqual(
        secondPattern.getElementsByTagName('path')[0].getAttribute('stroke'),
        '#ff0000',
        'Second pattern has path with correct color'
    );

    assert.strictEqual(
        secondPattern.getElementsByTagName('rect')[0].getAttribute('fill'),
        '#000000',
        'Second pattern has rect with correct color'
    );

    assert.strictEqual(
        points[2].graphic.element.getAttribute('fill'),
        'url(#custom-id)',
        'Third point has pattern link as color'
    );
});


QUnit.test('Pattern fills set on points', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'bubble',
                keys: ['x', 'y', 'z', 'color'],
                data: [
                    [1, 1, 1, 'url(#highcharts-default-pattern-0)'],
                    [2, 1, 1, {
                        pattern: {
                            id: 'custom-1',
                            path: 'M 3 3 L 8 3 L 8 8 Z',
                            width: 12,
                            height: 12,
                            color: '#ff0000'
                        }
                    }], [3, 1, 1, {
                        pattern: {
                            id: 'custom-2',
                            path: 'M 3 3 L 8 3 L 8 8 Z',
                            width: 20,
                            height: 15,
                            color: '#0000ff'
                        }
                    }]
                ]
            }]
        }),
        points = chart.series[0].points,
        doc = Highcharts.win.document,
        firstPattern = doc.getElementById('highcharts-default-pattern-0'),
        secondPattern = doc.getElementById('custom-1'),
        thirdPattern = doc.getElementById('custom-2');

    assert.strictEqual(
        firstPattern.tagName.toLowerCase(),
        'pattern',
        'First pattern exists'
    );

    assert.strictEqual(
        secondPattern.tagName.toLowerCase(),
        'pattern',
        'Second pattern exists'
    );

    assert.strictEqual(
        thirdPattern.tagName.toLowerCase(),
        'pattern',
        'Third pattern exists'
    );

    assert.strictEqual(
        points[0].graphic.element.getAttribute('fill'),
        'url(#highcharts-default-pattern-0)',
        'First point has pattern link as color'
    );

    assert.strictEqual(
        points[1].graphic.element.getAttribute('fill'),
        'url(#custom-1)',
        'Second point has pattern link as color'
    );

    assert.strictEqual(
        points[2].graphic.element.getAttribute('fill'),
        'url(#custom-2)',
        'Third point has pattern link as color'
    );

    assert.strictEqual(
        secondPattern.getElementsByTagName('path')[0].getAttribute('stroke'),
        '#ff0000',
        'Second pattern has path with correct color'
    );

    assert.strictEqual(
        thirdPattern.getAttribute('width'),
        '20',
        'Third pattern has correct width'
    );
});


QUnit.test('Auto IDs and no duplicate elements', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [{
                type: 'pie',
                colorByPoint: false,
                keys: ['y', 'color'],
                color: {
                    pattern: {
                        width: 5,
                        height: 5,
                        path: {
                            stroke: '#ff0000'
                        }
                    }
                },
                data: [
                    1,
                    [1, 'url(#highcharts-default-pattern-0)'],
                    [1, 'url(#highcharts-default-pattern-0)'],
                    [1, { pattern: { path: 'M 3 3 L 8 3 L 8 8 Z' } }],
                    [1, { pattern: { path: 'M 3 3 L 8 3 L 8 8 L 3 8 Z' } }],
                    [1, { pattern: { path: 'M 3 3 L 8 3 L 8 8 Z' } }],
                    [1, { pattern: { path: 'M 3 3 L 8 3 L 8 8 L 3 8 Z' } }],
                    [1, {
                        pattern: {
                            path: 'M 3 3 L 8 3 L 8 8 Z', id: 'pattern-bob'
                        }
                    }]
                ]
            }]
        }),
        defs = chart.renderer.defs.element,
        patterns = defs.getElementsByTagName('pattern'),
        ids = [],
        customPattern;

    assert.strictEqual(
        patterns.length,
        13,
        'Number of pattern defs should be 10 defaults + 3 unique'
    );

    Highcharts.each(patterns, function (pattern) {
        var id = pattern.getAttribute('id');
        if (id.indexOf('highcharts-pattern-') > -1) {
            customPattern = pattern;
        }
        if (Highcharts.inArray(id, ids) > -1) {
            assert.ok(false,
                'Expected unique ids for patterns. Duplicate: ' + id);
        }
        ids.push(id);
    });

    assert.strictEqual(
        customPattern.getAttribute('width'),
        '5',
        'Width of point pattern should be inherited from series.'
    );

    assert.strictEqual(
        customPattern.firstChild.getAttribute('stroke'),
        '#ff0000',
        'Color of point pattern should be inherited from series.'
    );
});


QUnit.test('Images (dummy images, not loaded)', function (assert) {
    var chart = Highcharts.mapChart('container', {
            chart: {
                map: 'custom/europe'
            },
            series: [{
                keys: ['hc-key', 'value', 'color'],
                color: {
                    pattern: {
                        width: 100,
                        height: 100
                    }
                },
                data: [
                    ['no', 1, {
                        pattern: {
                            image: 'abc'
                        }
                    }],
                    ['dk', 1, {
                        pattern: {
                            image: 'abc'
                        }
                    }],
                    ['se', 1, {
                        pattern: {
                            image: 'def'
                        }
                    }],
                    ['fi', 1, {
                        pattern: {
                            image: 'def',
                            width: 10,
                            height: null // Autocompute
                        }
                    }]
                ]
            }]
        }),
        finlandPoint = chart.series[0].points[3],
        defs = chart.renderer.defs.element,
        patterns = defs.getElementsByTagName('pattern'),
        ids = [],
        customPattern;

    assert.strictEqual(
        finlandPoint.name,
        'Finland',
        'Finland point should be 4th point'
    );

    assert.strictEqual(
        patterns.length,
        13,
        'Number of pattern defs should be 10 defaults + 3 unique'
    );

    Highcharts.each(patterns, function (pattern) {
        var id = pattern.getAttribute('id');
        if (id.indexOf('highcharts-pattern-') > -1) {
            customPattern = pattern;
        }
        if (Highcharts.inArray(id, ids) > -1) {
            assert.ok(false,
                'Expected unique ids for patterns. Duplicate: ' + id);
        }
        ids.push(id);
    });

    assert.strictEqual(
        customPattern.getAttribute('width'),
        '10',
        'Width of point pattern should not be inherited from series.'
    );

    assert.strictEqual(
        customPattern.getAttribute('height'),
        '' + Math.round(finlandPoint.graphic.element.getBBox().height),
        'Height of point pattern should be autocomputed.'
    );

    assert.strictEqual(
        customPattern.firstChild.tagName.toLowerCase(),
        'image',
        'Pattern should have an image element.'
    );
});
