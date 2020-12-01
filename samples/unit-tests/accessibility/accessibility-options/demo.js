function getScreenReaderSectionEl(chart) {
    var a11y = chart.accessibility,
        components = a11y && a11y.components,
        infoRegions = components && components.infoRegions;
    return infoRegions && infoRegions.screenReaderSections.before.element;
}

function getPointAriaLabel(point) {
    return point.graphic.element.getAttribute('aria-label');
}

function getSeriesAriaLabel(series) {
    return series.markerGroup.element.getAttribute('aria-label');
}

function isPointAriaHidden(point) {
    return point.graphic.element.getAttribute('aria-hidden') === 'true';
}

QUnit.test('Accessibility disabled', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                enabled: false
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        point = chart.series[0].points[0],
        srSection = getScreenReaderSectionEl(chart);

    assert.notOk(getPointAriaLabel(point), 'There be no ARIA on point');

    assert.notOk(
        srSection && srSection.getAttribute('aria-label'),
        'There be no screen reader region'
    );
});

QUnit.test('Keyboard nav disabled', function (assert) {
    const chart = Highcharts.chart('container', {
        accessibility: {
            keyboardNavigation: {
                enabled: false
            }
        },
        series: [
            {
                data: [1]
            }
        ]
    });

    assert.notOk(
        chart.container.getAttribute('tabindex'),
        'There is no tabindex on container'
    );
});

QUnit.test('No data', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{}]
    });

    assert.ok(
        getScreenReaderSectionEl(chart).getAttribute('aria-label'),
        'There be screen reader region, empty series'
    );

    chart = Highcharts.chart('container', {});
    assert.ok(
        getScreenReaderSectionEl(chart).getAttribute('aria-label'),
        'There be screen reader region, no series option'
    );

    chart = Highcharts.chart('container', {
        series: []
    });
    assert.ok(
        getScreenReaderSectionEl(chart).getAttribute('aria-label'),
        'There be screen reader region, no series items'
    );
});

QUnit.test('pointDescriptionEnabledThreshold', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                series: {
                    pointDescriptionEnabledThreshold: 7,
                    describeSingleSeries: true
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        series = chart.series[0];

    assert.ok(getPointAriaLabel(series.points[0]), 'There be ARIA on point');
    assert.ok(getSeriesAriaLabel(series), 'There be ARIA on series');

    series.addPoint(4);

    assert.notOk(
        getPointAriaLabel(series.points[6]),
        'There be no ARIA on point'
    );
    assert.ok(getSeriesAriaLabel(series), 'There be ARIA on series');
});

QUnit.test('pointNavigationThreshold', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                keyboardNavigation: {
                    seriesNavigation: {
                        pointNavigationEnabledThreshold: 7
                    }
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        point = chart.series[0].points[0];

    assert.ok(getPointAriaLabel(point), 'There be ARIA on point');
    assert.strictEqual(
        point.graphic.element.getAttribute('tabindex'),
        '-1',
        'There be tabindex on point'
    );
    assert.strictEqual(
        getSeriesAriaLabel(chart.series[0]),
        '',
        'There be empty ARIA on series'
    );

    point.series.addPoint(4);

    assert.ok(
        getPointAriaLabel(point.series.points[6]),
        'There still be ARIA on point'
    );
    assert.strictEqual(
        getSeriesAriaLabel(chart.series[0]),
        '',
        'There still be ARIA on series'
    );
});

QUnit.test('seriesDescriptionFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
        accessibility: {
            series: {
                descriptionFormatter: function (series) {
                    return 'yo ' + series.name;
                },
                describeSingleSeries: true
            }
        },
        series: [
            {
                data: [1, 2, 3, 4, 5, 6],
                name: 'First'
            },
            {
                data: [1, 2, 3, 4, 5, 6],
                name: 'Second with <em>markup</em>'
            }
        ]
    });

    assert.strictEqual(
        getSeriesAriaLabel(chart.series[0]),
        'yo First',
        'Custom aria-label on series'
    );
    assert.strictEqual(
        getSeriesAriaLabel(chart.series[1]),
        'yo Second with markup',
        'Custom aria-label, markup stripped away'
    );
});

QUnit.test('pointDescriptionFormatter', function (assert) {
    var chart = Highcharts.chart('container', {
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        return 'yo' + point.index;
                    }
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        point = chart.series[0].points[0];

    assert.strictEqual(
        getPointAriaLabel(point),
        'yo0',
        'Custom aria-label on point'
    );
});

QUnit.test('Chart description', function (assert) {
    var chart = Highcharts.chart('container', {
        accessibility: {
            description: 'Description: Yo.'
        },
        series: [
            {
                data: [1, 2, 3, 4, 5, 6]
            }
        ]
    });
    assert.ok(
        getScreenReaderSectionEl(chart).innerHTML.indexOf('Description: Yo.') >
            -1,
        'Chart description included in screen reader region'
    );
});

QUnit.test('Landmark verbosity', function (assert) {
    var numRegions = function (chart) {
            return (chart.renderTo.outerHTML.match(/role="region"/g) || [])
                .length;
        },
        chart = Highcharts.chart('container', {
            accessibility: {
                landmarkVerbosity: 'disabled'
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        });
    assert.strictEqual(numRegions(chart), 0, 'No landmarks in chart');

    chart.update({
        accessibility: {
            landmarkVerbosity: 'one'
        }
    });
    assert.strictEqual(numRegions(chart), 1, 'One landmark in chart');

    chart.update({
        accessibility: {
            landmarkVerbosity: 'all'
        }
    });
    assert.ok(numRegions(chart) > 1, 'More than one landmark');
});

QUnit.test('exposeAsGroupOnly', function (assert) {
    const chart = Highcharts.chart('container', {
            accessibility: {
                series: {
                    describeSingleSeries: false
                }
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5, 6]
                }
            ]
        }),
        series = chart.series[0],
        point = series.points[0];

    assert.ok(getPointAriaLabel(point), 'Point has aria');
    assert.notOk(isPointAriaHidden(point), 'Point is not aria hidden');
    assert.notOk(
        getSeriesAriaLabel(chart.series[0]),
        'Series does not have aria'
    );

    series.update({
        accessibility: {
            exposeAsGroupOnly: true
        }
    });

    assert.ok(isPointAriaHidden(point), 'Point is aria hidden');
    assert.ok(getSeriesAriaLabel(chart.series[0]), 'Series has aria');
});

QUnit.test('Focus border in wordcloud', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            margin: 0
        },
        series: [
            {
                type: 'wordcloud',
                data: [
                    {
                        name: 'Lorem',
                        weight: 1
                    },
                    {
                        name: 'ipsum',
                        weight: 2
                    },
                    {
                        name: 'test',
                        weight: 1
                    }
                ]
            }
        ]
    });

    const point = chart.series[0].points[2];
    // Apply focus border.
    chart.setFocusToElement(point.graphic);

    const focusBorderX = chart.focusElement.focusBorder.attr('x'),
        focusBorderWidth = chart.focusElement.focusBorder.attr('width'),
        focusBorderY = chart.focusElement.focusBorder.attr('y'),
        focusBorderHeight = chart.focusElement.focusBorder.attr('height'),
        focusElementX = chart.focusElement.attr('x'),
        focusElementY = chart.focusElement.attr('y'),
        focusElementHeight = point.graphic.getBBox().height,
        H = Highcharts;

    assert.strictEqual(
        focusBorderX + focusBorderWidth / 2,
        focusElementX,
        'should be correctly applied for text elements horizontally, #11397'
    );

    // Correct baseline position on Firefox.
    assert.strictEqual(
        focusBorderY + focusBorderHeight / 2,
        H.isFirefox ? focusElementY - focusElementHeight * 0.25 : focusElementY,
        'should be correctly applied for text elements vertically, #11397'
    );
});

QUnit.test('Focus border', function (assert) {
    const H = Highcharts;
    const ren = new H.Renderer(document.getElementById('container'), 600, 400);

    const style = {
        stroke: 'blue',
        strokeWidth: 1
    };

    const regularText = ren.text('regular text', 50, 50).add();
    regularText.addFocusBorder(2, style);

    const wordcloudText = ren
        .text('wordcloud text', 100, 100)
        .attr({
            'alignment-baseline': 'middle',
            'text-anchor': 'middle'
        })
        .css({
            color: 'red',
            whiteSpace: 'nowrap'
        })
        .add();
    wordcloudText.addFocusBorder(2, style);

    const regularRotatedText = ren
        .text('regular rotated text', 150, 150)
        .attr({
            rotation: 90
        })
        .add();
    regularRotatedText.addFocusBorder(2, style);

    const wordcloudRotatedText = ren
        .text('wordcloud rotated text', 200, 200)
        .attr({
            'alignment-baseline': 'middle',
            'text-anchor': 'middle',
            rotation: 90
        })
        .css({
            color: 'red',
            whiteSpace: 'nowrap'
        })
        .add();
    wordcloudRotatedText.addFocusBorder(2, style);

    const labelText = ren
        .label('label', 250, 250)
        .css({
            color: 'blue'
        })
        .add();
    labelText.addFocusBorder(2, style);

    const labelRotatedText = ren
        .label('rotated label', 300, 300)
        .attr({
            rotation: 90
        })
        .css({
            color: 'blue'
        })
        .add();
    labelRotatedText.addFocusBorder(2, style);

    // Comparing the midpoint of the border with the midpoint of the text.
    assert.close(
        regularText.focusBorder.getBBox().x +
            regularText.focusBorder.getBBox().width / 2,
        regularText.attr('x') + regularText.getBBox().width / 2,
        0.1,
        'should be correctly applied for text horizontally.'
    );

    assert.close(
        regularText.focusBorder.getBBox().y +
            regularText.focusBorder.getBBox().height / 2,
        regularText.attr('y') - (regularText.getBBox().height / 2) * 0.5,
        0.1,
        'should be correctly applied for text vertically.'
    );

    assert.close(
        regularRotatedText.focusBorder.getBBox().x +
            regularRotatedText.focusBorder.getBBox().width / 2,
        regularRotatedText.attr('x') +
            (regularRotatedText.getBBox().width / 2) * 0.5,
        0.1,
        'should be correctly applied for rotated text horizontally.'
    );

    assert.close(
        regularRotatedText.focusBorder.getBBox().y +
            regularRotatedText.focusBorder.getBBox().height / 2,
        regularRotatedText.attr('y') + regularRotatedText.getBBox().height / 2,
        0.1,
        'should be correctly applied for rotated text element vertically.'
    );

    assert.close(
        wordcloudText.focusBorder.getBBox().x +
            wordcloudText.focusBorder.getBBox().width / 2,
        wordcloudText.attr('x') +
            wordcloudText.getBBox().width *
                (H.isFirefox && wordcloudText.rotation ? 0.25 : 0),
        0.1,
        'should be correctly applied for wordcloud text element horizontally.'
    );

    assert.close(
        wordcloudRotatedText.focusBorder.getBBox().y +
            wordcloudRotatedText.focusBorder.getBBox().height / 2,
        wordcloudRotatedText.attr('y') +
            wordcloudRotatedText.getBBox().height *
                (H.isFirefox && !wordcloudRotatedText.rotation ? -0.25 : 0),
        0.1,
        'should be correctly for wordcloud text element vertically.'
    );

    assert.close(
        labelText.focusBorder.getBBox().x +
            labelText.focusBorder.getBBox().width / 2,
        labelText.attr('x') + labelText.getBBox().width / 2,
        0.1,
        'should be correctly for labels horizontally.'
    );

    assert.close(
        labelText.focusBorder.getBBox().x +
            labelText.focusBorder.getBBox().height / 2,
        labelText.attr('y') + labelText.getBBox().height / 2,
        0.1,
        'should be correctly for labels vertically.'
    );

    assert.close(
        labelRotatedText.focusBorder.getBBox().x +
            labelRotatedText.focusBorder.getBBox().width / 2,
        labelRotatedText.attr('x') - labelRotatedText.getBBox().height / 2,
        0.1,
        'should be correctly for rotated labels horizontally.'
    );

    assert.close(
        labelRotatedText.focusBorder.getBBox().y +
            labelRotatedText.focusBorder.getBBox().height / 2,
        labelRotatedText.attr('y') + labelRotatedText.getBBox().width / 2,
        0.1,
        'should be correctly for rotated labels vertically.'
    );

    ren.destroy();
});
