QUnit.test(
    'Pages and navigation of legend',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                width: 250
            },
            legend: {
                maxHeight: 47,
                itemStyle: {
                    fontSize: '11px'
                }
            },
            series: [{}, {}, {}, {}, {}, {}, {}, {}]
        });

        assert.strictEqual(
            chart.legend.pages.length,
            4,
            'There should be enough pages to fully fit all elements (#13683)'
        );

        chart.update({
            chart: {
                width: 440
            },
            legend: {
                maxHeight: 40,
                itemStyle: {
                    fontSize: '12px'
                }
            }
        }, false);
        chart.addSeries({});

        assert.strictEqual(
            chart.legend.pages.length,
            3,
            'The last item should not be omitted (#18768)'
        );
    }
);

QUnit.test('Horizontal legend paging (#7513)', function (assert) {
    const lines = legend => new Set(
        legend.allItems.map(item => item.legendItem.y)
    ).size;

    const chart = Highcharts.chart('container', {
        chart: {
            width: 400
        },
        legend: {
            navigation: {
                direction: 'horizontal',
                animation: false
            }
        },
        series: [
            { name: 'Alpha' },
            { name: 'Bravo' },
            { name: 'Charlie' },
            { name: 'Delta' },
            { name: 'Echo' },
            { name: 'Foxtrot' },
            { name: 'Golf' },
            { name: 'Hotel' }
        ]
    });

    const legend = chart.legend;

    assert.ok(legend.pages.length > 1, 'The legend should be paged');

    assert.strictEqual(lines(legend), 1, 'The items should stay on one line');

    assert.ok(
        legend.clipWidth > 0 && !legend.clipHeight,
        'The legend should be clipped in width, not in height'
    );

    assert.ok(
        legend.legendWidth < chart.chartWidth,
        'The legend box should be capped to the available width'
    );

    assert.strictEqual(
        +legend.clipRect.element.getAttribute('width'),
        legend.pages[1] - legend.pages[0],
        'The page should be clipped where the next one starts'
    );

    legend.scroll(1, false);

    assert.strictEqual(legend.currentPage, 2, 'Paging should move on');

    assert.ok(
        legend.scrollOffset < 0,
        'The items should be translated sideways'
    );

    assert.strictEqual(
        legend.allItems.filter(
            item => item.a11yProxyElement.element.style.visibility === 'hidden'
        ).length,
        legend.allItems.filter(
            item => item.legendItem.pageIx !== legend.currentPage - 1
        ).length,
        'Only the current page should be exposed to screen readers'
    );

    // Without arrows to page with, the items have to wrap in order to stay
    // visible in static exports
    chart.update({
        legend: {
            navigation: {
                enabled: false
            }
        }
    });

    assert.ok(
        lines(chart.legend) > 1,
        'The items should wrap when the navigation is disabled'
    );

    // Not supported yet, falls back to wrapping and vertical paging
    chart.update({
        legend: {
            rtl: true,
            navigation: {
                enabled: true
            }
        }
    });

    assert.notOk(
        chart.legend.horizontalNav,
        'Right-to-left legends should keep the default layout'
    );
});
