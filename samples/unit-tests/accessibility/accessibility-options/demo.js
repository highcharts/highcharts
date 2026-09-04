function getScreenReaderSectionEl(chart) {
    var a11y = chart.accessibility,
        components = a11y && a11y.components,
        infoRegions = components && components.infoRegions;
    return infoRegions && infoRegions.screenReaderSections.before.element;
}

function screenReaderSectionHasContents(sectionEl) {
    return sectionEl.textContent.length > 0;
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
            title: {
                text: 'No a11y'
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
        srSection && screenReaderSectionHasContents(srSection),
        'There be no screen reader region'
    );

    assert.strictEqual(
        chart.renderer.box.getAttribute('aria-label'),
        'No a11y',
        'SVG root has aria label'
    );

    assert.strictEqual(
        chart.renderer.box.getAttribute('role'),
        'img',
        'SVG root has img role'
    );

    assert.strictEqual(
        chart.renderTo.getAttribute('aria-label'),
        'No a11y',
        'Chart container has aria label'
    );

    assert.strictEqual(
        chart.renderTo.getAttribute('role'),
        'img',
        'Chart container has img role'
    );

    chart.update({
        accessibility: {
            enabled: true
        }
    });

    assert.strictEqual(
        chart.renderer.box.getAttribute('role'),
        null,
        'SVG root has no role after enabling a11y'
    );

    assert.strictEqual(
        chart.renderTo.getAttribute('role'),
        'region',
        'Chart container has region role after enabling a11y'
    );

    chart.update({
        accessibility: {
            enabled: false
        }
    });
    assert.strictEqual(
        chart.renderTo.getAttribute('role'),
        'img',
        'Chart container has img role again after disabling a11y'
    );
});

QUnit.test('Point hidden from AT', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, {
                        y: 2,
                        accessibility: {
                            enabled: false
                        }
                    }, 3, 4, 5, 6]
                }
            ]
        }),
        pointA = chart.series[0].points[0],
        pointB = chart.series[0].points[1];

    assert.ok(getPointAriaLabel(pointA), 'There should be ARIA on point A');
    assert.notOk(
        getPointAriaLabel(pointB), 'There should be no ARIA label ' +
        'on point B'
    );
    assert.ok(isPointAriaHidden(pointB), 'Point B should be ARIA hidden');
});

QUnit.test('Keyboard navigation', function (assert) {
    let eventProps;
    const
        chart = Highcharts.chart('container', {
            series: [
                {
                    events: {
                        click: function (e) {
                            eventProps = e;
                        }
                    },
                    data: [0, null],
                    nullInteraction: true
                },
                {
                    data: [0]
                },
                {
                    data: [0]
                }
            ]
        }),
        /*
            KEYCODE DICTIONARY:
                + Right =   39
                + Left  =   37
                + Up    =   38
                + Down  =   40
                + Tab   =   9
                + Home  =   36
        */
        keyboardNavigation = chart.accessibility.keyboardNavigation,
        eventDispatcher = keyCode => {
            const event = new KeyboardEvent('keydown', { keyCode });
            keyboardNavigation.onKeydown(event);
        };

    eventDispatcher(36);
    eventDispatcher(13);

    assert.strictEqual(
        chart.series[0].data[0].graphic.element,
        eventProps.target,
        'Event target should be first points graphic'
    );

    eventDispatcher(39);

    assert.strictEqual(
        chart.focusElement.element.outerHTML.includes('highcharts-null-point'),
        true,
        'Null points should be targetable via keyboard navigation'
    );


    eventDispatcher(9);
    eventDispatcher(37);

    assert.strictEqual(
        keyboardNavigation
            .components
            .legend
            .highlightedLegendItemIx, 2,
        'Last legend item should be highlighted.'
    );

    eventDispatcher(39);

    assert.strictEqual(
        keyboardNavigation
            .components
            .legend
            .highlightedLegendItemIx, 0,
        'First legend item should be highlighted.'
    );

    assert.ok(
        chart.container.parentNode.querySelector('.highcharts-exit-anchor'),
        'The exit anchor element should render.'
    );

    keyboardNavigation.update({ wrapAround: false });

    eventDispatcher(37);

    assert.strictEqual(
        keyboardNavigation
            .components
            .legend
            .highlightedLegendItemIx, 0,
        'First legend item should still be highlighted when wrapAround is off.'
    );

    eventDispatcher(13);
    eventDispatcher(36);

    chart.update({
        accessibility: {
            keyboardNavigation: {
                enabled: false
            }
        }
    });

    assert.notOk(
        chart.container.getAttribute('tabindex'),
        'There is no tabindex on container'
    );

    assert.ok(
        !chart.container.parentNode.querySelector('.highcharts-exit-anchor'),
        'The exit anchor element shouldn\'t be rendered (#19374).'
    );

    chart.update({
        accessibility: {
            highContrastMode: true,
            highContrastTheme: {
                colors: ['#ff0000', '#00ff00', '#0000ff']
            }
        }
    });

    assert.strictEqual(
        chart.options.colors.length,
        3,
        'The colors array should be updated with high contrast colors.'
    );
});

QUnit.test(
    'skipNullPoints only skips null points, not valid ones (#24650)',
    function (assert) {
        const homeKey = 36;
        const chart = Highcharts.chart('container', {
            accessibility: {
                keyboardNavigation: {
                    seriesNavigation: {
                        skipNullPoints: true
                    }
                }
            },
            series: [{
                // The first null must be skipped, but the valid points
                // after it should still be reachable.
                data: [null, 2, 3]
            }]
        });

        chart.accessibility.keyboardNavigation.onKeydown(
            new KeyboardEvent('keydown', { keyCode: homeKey })
        );
        const point = chart.highlightedPoint;

        assert.ok(
            point,
            'Keyboard navigation should reach a point when skipNullPoints ' +
            'is true.'
        );
        assert.notOk(
            point && point.isNull,
            'Navigation should skip the null point and land on a valid point.'
        );
    }
);

QUnit.test('No data', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{}]
    });

    assert.ok(
        screenReaderSectionHasContents(getScreenReaderSectionEl(chart)),
        'There be screen reader region, empty series'
    );

    chart = Highcharts.chart('container', {});
    assert.ok(
        screenReaderSectionHasContents(getScreenReaderSectionEl(chart)),
        'There be screen reader region, no series option'
    );

    chart = Highcharts.chart('container', {
        series: []
    });
    assert.ok(
        screenReaderSectionHasContents(getScreenReaderSectionEl(chart)),
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

QUnit.test('High contrast theme should persist on chart update', function (
    assert
) {
    const options = {
        accessibility: {
            highContrastMode: true,
            highContrastTheme: {
                yAxis: {
                    plotLines: [{
                        color: '#ff0000',
                        value: 2,
                        width: 2
                    }]
                }
            }
        },
        yAxis: {
            plotLines: [{
                color: '#0000ff',
                value: 2,
                width: 2
            }]
        },
        series: [{
            data: [1, 2, 3]
        }]
    };
    const chart = Highcharts.chart('container', options);
    let plotLine = chart.yAxis[0].plotLinesAndBands[0];

    assert.strictEqual(
        plotLine.svgElem.element.getAttribute('stroke'),
        '#ff0000',
        'Plot line should use the high contrast color on first render'
    );

    chart.update(options);
    plotLine = chart.yAxis[0].plotLinesAndBands[0];

    assert.strictEqual(
        plotLine.svgElem.element.getAttribute('stroke'),
        '#ff0000',
        'Plot line should keep the high contrast color after chart.update'
    );
});

/**
 * Run a test body with the `(forced-colors: active)` media query faked, so
 * that Windows High Contrast Mode can be switched on and off from a test.
 *
 * The body gets a handle with `chart` for creating charts that are cleaned up
 * afterwards, `set` for toggling forced colors, and `listenerCount` for
 * asserting that listeners are removed again.
 */
function withForcedColors(body) {
    const originalMatchMedia = window.matchMedia,
        query = '(forced-colors: active)',
        charts = [];

    let listeners = [],
        matches = false;

    const mediaQueryList = {
        media: query,
        get matches() {
            return matches;
        },
        addEventListener: function (type, listener) {
            if (type === 'change') {
                listeners.push(listener);
            }
        },
        removeEventListener: function (type, listener) {
            if (type === 'change') {
                listeners = listeners.filter(function (item) {
                    return item !== listener;
                });
            }
        }
    };

    window.matchMedia = function (mediaQuery) {
        return mediaQuery === query ?
            mediaQueryList :
            originalMatchMedia.call(window, mediaQuery);
    };

    try {
        body({
            chart: function (options) {
                const chart = Highcharts.chart('container', options);
                charts.push(chart);
                return chart;
            },
            listenerCount: function () {
                return listeners.length;
            },
            set: function (active) {
                matches = active;
                listeners.slice().forEach(function (listener) {
                    listener.call(mediaQueryList, {
                        matches: matches,
                        media: query
                    });
                });
            }
        });
    } finally {
        charts.forEach(function (chart) {
            // `destroy` deletes the chart's own properties, so a live chart is
            // one that still has options
            if (chart.options) {
                chart.destroy();
            }
        });
        window.matchMedia = originalMatchMedia;
    }
}

QUnit.test('High contrast auto mode should follow forced colors', function (
    assert
) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            accessibility: {
                highContrastTheme: {
                    yAxis: {
                        plotLines: [{
                            color: '#ff0000',
                            value: 2,
                            width: 2
                        }]
                    }
                }
            },
            yAxis: {
                plotLines: [{
                    color: '#0000ff',
                    value: 2,
                    width: 2
                }]
            },
            series: [{
                data: [{
                    color: '#00ff00',
                    y: 1
                }, 2, 3]
            }]
        });

        const getPlotLineColor = () => chart.yAxis[0]
            .plotLinesAndBands[0]
            .svgElem
            .element
            .getAttribute('stroke');

        const regularSeriesColor = chart.series[0].color;

        assert.strictEqual(
            getPlotLineColor(),
            '#0000ff',
            'Plot line should use regular color before forced colors'
        );

        forcedColors.set(true);

        assert.strictEqual(
            getPlotLineColor(),
            '#ff0000',
            'Plot line should use high contrast color when forced colors start'
        );

        assert.strictEqual(
            chart.series[0].color,
            'windowText',
            'Series should use high contrast color when forced colors start'
        );

        assert.strictEqual(
            chart.series[0].points[0].color,
            'windowText',
            'Point should use high contrast color when forced colors start'
        );

        forcedColors.set(false);

        assert.strictEqual(
            getPlotLineColor(),
            '#0000ff',
            'Plot line should restore regular color when forced colors stop'
        );

        assert.strictEqual(
            chart.series[0].color,
            regularSeriesColor,
            'Series should restore regular color when forced colors stop'
        );

        assert.strictEqual(
            chart.series[0].points[0].color,
            '#00ff00',
            'Point should restore regular color when forced colors stop'
        );

        // Toggling repeatedly should not lose the original options
        forcedColors.set(true);
        forcedColors.set(false);

        assert.strictEqual(
            getPlotLineColor(),
            '#0000ff',
            'Plot line should restore regular color after a second toggle'
        );

        chart.destroy();

        assert.strictEqual(
            forcedColors.listenerCount(),
            0,
            'Media query listener should be removed on chart destroy'
        );
    });
});

QUnit.test('High contrast theme should be removed with the option', function (
    assert
) {
    const chart = Highcharts.chart('container', {
        chart: {
            backgroundColor: '#123456'
        },
        accessibility: {
            highContrastMode: false
        },
        series: [{
            data: [1, 2, 3]
        }]
    });
    const regularSeriesColor = chart.series[0].color;

    chart.update({
        accessibility: {
            highContrastMode: true
        }
    });

    assert.strictEqual(
        chart.options.chart.backgroundColor,
        'window',
        'Background should be themed when the option is turned on'
    );

    chart.update({
        accessibility: {
            highContrastMode: false
        }
    });

    assert.strictEqual(
        chart.options.chart.backgroundColor,
        '#123456',
        'Background should be restored when the option is turned off'
    );

    assert.strictEqual(
        chart.series[0].color,
        regularSeriesColor,
        'Series color should be restored when the option is turned off'
    );

    chart.destroy();
});

QUnit.test('High contrast theme should not swallow updates', function (assert) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            chart: {
                backgroundColor: '#123456'
            },
            series: [{
                data: [1, 2, 3],
                color: '#00ff00'
            }]
        });

        forcedColors.set(true);

        // Updates made while the theme is applied should survive it
        chart.update({
            chart: {
                backgroundColor: '#654321'
            }
        });
        chart.series[0].update({
            color: '#ff0000'
        });
        chart.addSeries({
            data: [3, 2, 1]
        });

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            'window',
            'Theme should still win while forced colors are active'
        );

        assert.strictEqual(
            chart.series[1].color,
            'windowText',
            'Series added while active should be themed'
        );

        forcedColors.set(false);

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            '#654321',
            'Chart update should survive the theme being removed'
        );

        assert.strictEqual(
            chart.series[0].color,
            '#ff0000',
            'Series update should survive the theme being removed'
        );

        assert.notStrictEqual(
            chart.series[1].color,
            'windowText',
            'Series added while active should be restored'
        );
    });
});

QUnit.test('High contrast theme should not swallow axis updates', function (
    assert
) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            yAxis: {
                gridLineColor: '#0000ff'
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        forcedColors.set(true);
        chart.yAxis[0].update({
            gridLineColor: '#ff0000'
        });

        assert.strictEqual(
            chart.yAxis[0].options.gridLineColor,
            'windowText',
            'Theme should still win after an axis update'
        );

        forcedColors.set(false);

        assert.strictEqual(
            chart.yAxis[0].options.gridLineColor,
            '#ff0000',
            'Axis update should survive the theme being removed'
        );
    });
});

QUnit.test('High contrast theme should preserve responsive state', function (
    assert
) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            chart: {
                backgroundColor: '#0000ff',
                width: 500
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 600
                    },
                    chartOptions: {
                        chart: {
                            backgroundColor: '#ff0000'
                        }
                    }
                }]
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        forcedColors.set(true);

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            'window',
            'Theme should win while the responsive rule is active'
        );

        chart.setSize(700, 400, false);

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            'window',
            'Theme should persist when the responsive rule stops matching'
        );

        chart.setSize(500, 400, false);

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            'window',
            'Theme should persist when the responsive rule matches again'
        );

        forcedColors.set(false);

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            '#ff0000',
            'Responsive color should be restored with forced colors off'
        );

        chart.setSize(700, 400, false);

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            '#0000ff',
            'Base color should return when the responsive rule stops matching'
        );
    });
});

QUnit.test('High contrast theme should not swallow direct updates', function (
    assert
) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            legend: {
                enabled: true,
                itemStyle: {
                    color: '#0000ff'
                }
            },
            tooltip: {
                backgroundColor: '#0000ff'
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        forcedColors.set(true);

        // `Legend#update` and `Tooltip#update` write into `chart.options`
        // without going through `chart.update`
        chart.legend.update({
            itemStyle: {
                color: '#ff0000'
            }
        });
        chart.tooltip.update({
            backgroundColor: '#ff0000'
        });

        forcedColors.set(false);

        assert.strictEqual(
            chart.options.legend.itemStyle.color,
            '#ff0000',
            'Legend update should survive the theme being removed'
        );

        assert.strictEqual(
            chart.options.tooltip.backgroundColor,
            '#ff0000',
            'Tooltip update should survive the theme being removed'
        );
    });
});

QUnit.test('High contrast theme removal after a quiet update', function (
    assert
) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            chart: {
                backgroundColor: '#123456'
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        const getBackground = () => chart.container
            .querySelector('.highcharts-background')
            .getAttribute('fill');

        forcedColors.set(true);

        // An update that does not redraw leaves the theme painted, but rolled
        // back from the options
        chart.update({
            chart: {
                backgroundColor: '#654321'
            }
        }, false);

        forcedColors.set(false);

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            '#654321',
            'Update should survive the theme being removed'
        );

        assert.strictEqual(
            getBackground(),
            '#654321',
            'Chart should be repainted when forced colors stop'
        );
    });
});

QUnit.test('High contrast theme should not leak into user options', function (
    assert
) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            chart: {
                backgroundColor: '#123456'
            },
            yAxis: {
                gridLineColor: '#0000ff'
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        const topLevelKeys = Object.keys(chart.userOptions).sort();

        forcedColors.set(true);
        forcedColors.set(false);

        assert.deepEqual(
            Object.keys(chart.userOptions).sort(),
            topLevelKeys,
            'User options should not gain the keys the theme touched'
        );

        assert.deepEqual(
            chart.userOptions.yAxis[0],
            {
                gridLineColor: '#0000ff'
            },
            'Axis user options should be handed back untouched'
        );

        assert.strictEqual(
            chart.userOptions.chart.backgroundColor,
            '#123456',
            'Chart user options should be handed back untouched'
        );

        assert.strictEqual(
            chart.userOptions.isResponsiveOptions,
            undefined,
            'The internal responsive flag should not be left behind'
        );

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            '#123456',
            'Resolved options should still be restored'
        );

        assert.strictEqual(
            chart.yAxis[0].options.gridLineColor,
            '#0000ff',
            'Axis options should still be restored'
        );
    });
});

QUnit.test('High contrast rollback should not nest chart updates', function (
    assert
) {
    withForcedColors(function (forcedColors) {
        const chart = forcedColors.chart({
            chart: {
                backgroundColor: '#123456'
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        forcedColors.set(true);

        let depth = 0,
            maxDepth = 0;

        // Ahead of the accessibility module's own listener, the way the
        // listeners of the modules composed before it are
        const removeUpdate = Highcharts.addEvent(
                chart,
                'update',
                function () {
                    maxDepth = Math.max(maxDepth, ++depth);
                },
                {
                    order: -1
                }
            ),
            removeAfterUpdate = Highcharts.addEvent(
                chart,
                'afterUpdate',
                function () {
                    depth--;
                }
            );

        try {
            // Without a redraw, the only nested update in play is the theme
            // rollback. The theme is re-applied from the next render.
            chart.update({
                chart: {
                    backgroundColor: '#654321'
                }
            }, false);
        } finally {
            removeUpdate();
            removeAfterUpdate();
        }

        assert.strictEqual(
            maxDepth,
            1,
            'The rollback update should run before the update that triggered ' +
                'it, not inside it'
        );

        assert.strictEqual(
            chart.options.chart.backgroundColor,
            '#654321',
            'The update should still be applied on top of the rollback'
        );
    });
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
    assert.notOk(
        getSeriesAriaLabel(chart.series[0]),
        'There is no aria-label on series'
    );

    point.series.addPoint(4);

    assert.ok(
        getPointAriaLabel(point.series.points[6]),
        'There still be ARIA on point'
    );
    assert.notOk(
        getSeriesAriaLabel(chart.series[0]),
        'There is still no aria-label on series'
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
        lang: {
            accessibility: {
                svgContainerLabel: 'Test'
            }
        },
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
    assert.strictEqual(
        chart.renderer.box.getAttribute('role'),
        null,
        'SVG root has no role'
    );
    assert.strictEqual(
        chart.renderer.box.getAttribute('aria-label'),
        'Test',
        'SVG root has aria label from lang'
    );

    chart.update({});
    assert.ok(
        document.querySelector('.highcharts-exit-anchor'),
        '#15986: There should still be an exit anchor after updating'
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
        focusElementY = chart.focusElement.attr('y');

    assert.strictEqual(
        focusBorderX + focusBorderWidth / 2,
        focusElementX,
        'should be correctly applied for text elements horizontally, #11397'
    );

    assert.strictEqual(
        focusBorderY + focusBorderHeight / 2,
        focusElementY,
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
    const padding = 2;

    const regularText = ren.text('regular text', 50, 50).add();
    regularText.addFocusBorder(padding, style);

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
    wordcloudText.addFocusBorder(padding, style);

    const regularRotatedText = ren
        .text('regular rotated text', 150, 150)
        .attr({
            rotation: 90
        })
        .add();
    regularRotatedText.addFocusBorder(padding, style);

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
    wordcloudRotatedText.addFocusBorder(padding, style);

    const labelText = ren
        .label('label', 250, 250)
        .css({
            color: 'blue'
        })
        .add();
    labelText.addFocusBorder(padding, style);

    const labelRotatedText = ren
        .label('rotated label', 300, 300)
        .attr({
            rotation: 90
        })
        .css({
            color: 'blue'
        })
        .add();
    labelRotatedText.addFocusBorder(padding, style);

    // Comparing the midpoint of the border with the midpoint of the text.
    assert.close(
        regularText.focusBorder.getBBox().x +
            regularText.focusBorder.getBBox().width / 2,
        regularText.attr('x') + regularText.getBBox().width / 2,
        0.1,
        'should be correctly applied for text horizontally.'
    );

    const lineHeight = ren.fontMetrics(regularText).h;
    assert.close(
        regularText.focusBorder.getBBox().y +
        (regularText.focusBorder.getBBox().height / 2),
        regularText.attr('y') - (lineHeight / 4),
        1,
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
