QUnit.test(
    '#6615 - enabling and disabling chart.scrollbar was broken.',
    function (assert) {
        var chart = Highcharts.stockChart('container', {
            scrollbar: {
                enabled: false
            },
            series: [
                {
                    data: [4, 20, 100, 5, 2, 33, 12, 23]
                }
            ]
        });

        chart.update({
            scrollbar: {
                enabled: true
            }
        });

        assert.strictEqual(
            !!chart.navigator.scrollbar,
            true,
            'Scrollbar rendered.'
        );

        chart.update({
            scrollbar: {
                enabled: false
            }
        });

        assert.strictEqual(
            !chart.navigator.scrollbar,
            true,
            'Scrollbar removed.'
        );
    }
);

QUnit.test('Remove base series with scrollbar only (#7378)', function (assert) {
    var chart = Highcharts.chart('container', {
        scrollbar: {
            enabled: true
        },
        series: [
            {
                data: [1, 2, 3]
            }
        ]
    });

    chart.series[0].remove(true, false);

    assert.strictEqual(
        chart.container.innerHTML.indexOf('NaN'),
        -1,
        'Index of NaN in SVG should be -1'
    );
});

QUnit.test(
    'Scrollbar size from CSS expression, including container-scoped ' +
    'variables (#23989)',
    function (assert) {
        const container = document.createElement('div');
        container.style.setProperty('--hc-scrollbar-size', '18px');
        document.body.appendChild(container);

        const chart = Highcharts.stockChart(container, {
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: true,
                size: 'var(--hc-scrollbar-size)'
            },
            series: [{
                data: [1, 2, 3]
            }]
        });

        assert.strictEqual(
            chart.scrollbar.size,
            18,
            'scrollbar.size should resolve to pixels when set via a CSS ' +
            'variable scoped to chart.container'
        );

        chart.destroy();
        document.body.removeChild(container);
    }
);
