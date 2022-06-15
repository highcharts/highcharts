QUnit.test('Basic map', function (assert) {
    const url =
        'https://upload.wikimedia.org/wikipedia/en/1/12/Flag_of_Poland.svg';
    const chart = Highcharts.mapChart('container', {
            chart: {
                map: 'custom/europe'
            },
            series: [
                {
                    keys: ['hc-key', 'val', 'color.pattern.image'],
                    data: [
                        ['no', 1],
                        ['pl', 2, url],
                        ['fi', 3],
                        ['gb', 4],
                        ['fr', 5],
                        ['it', 6]
                    ]
                }
            ]
        }),
        description = chart.accessibility.components.infoRegions
            .screenReaderSections.before.element.textContent;

    assert.ok(
        description.indexOf('Europe') > 0,
        'There is a screen reader region, and it contains "Europe"'
    );

    assert.strictEqual(
        chart.series[0].transformGroups[0].scaleY < 0,
        // eslint-disable-next-line no-underscore-dangle
        chart.series[0].points[1].options.color.pattern._inverted,
        'Point with pattern should be marked as inverted (#16810).'
    );
});

QUnit.test('Map with series info', function (assert) {
    var chart = Highcharts.mapChart('container', {
        accessibility: {
            series: {
                describeSingleSeries: true
            }
        },
        chart: {
            map: 'custom/europe'
        },
        series: [
            {
                data: [
                    ['no', 1],
                    ['se', 2],
                    ['fi', 3],
                    ['gb', 4],
                    ['fr', 5],
                    ['it', 6]
                ]
            }
        ]
    });

    assert.ok(
        chart.series[0].points[0].graphic.element.parentNode.getAttribute(
            'aria-label'
        ),
        'There be ARIA on series'
    );

    assert.ok(
        chart.accessibility.components.infoRegions.screenReaderSections.before
            .element.textContent.length,
        'There be screen reader region'
    );
});

QUnit.test('Map with point info', function (assert) {
    var chart = Highcharts.mapChart('container', {
        accessibility: {
            series: {
                pointDescriptionEnabledThreshold: false
            }
        },
        chart: {
            map: 'custom/europe'
        },
        series: [
            {
                data: [
                    ['no', 1],
                    ['se', 2],
                    ['fi', 3],
                    ['gb', 4],
                    ['fr', 5],
                    ['it', 6]
                ]
            }
        ]
    });

    assert.ok(
        chart.series[0].points[0].graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );
});

QUnit.test('Map navigation', function (assert) {
    var chart = Highcharts.mapChart('container', {
        accessibility: {
            series: {
                pointDescriptionEnabledThreshold: false
            }
        },
        chart: {
            map: 'custom/europe'
        },
        mapNavigation: {
            enabled: true
        },
        series: [
            {
                data: [
                    ['no', 1],
                    ['se', 2],
                    ['fi', 3],
                    ['gb', 4],
                    ['fr', 5],
                    ['it', 6]
                ]
            }
        ]
    });

    assert.ok(
        chart.series[0].points[0].graphic.element.getAttribute('aria-label'),
        'There be ARIA on point'
    );
});
