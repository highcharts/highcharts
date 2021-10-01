QUnit.test(
    'Series should be hidden from screen readers when not visible',
    function (assert) {
        var chart = Highcharts.chart('container', {
                series: [
                    {
                        data: [1, 2, 3]
                    },
                    {
                        data: [4, 5, 6]
                    }
                ]
            }),
            seriesA = chart.series[0],
            seriesB = chart.series[1],
            getSeriesAriaHidden = function (series) {
                return Highcharts.A11yChartUtilities.getSeriesA11yElement(
                    series
                ).getAttribute('aria-hidden');
            };

        assert.strictEqual(
            getSeriesAriaHidden(seriesA),
            'false',
            'Series should not be hidden from AT'
        );
        assert.strictEqual(
            getSeriesAriaHidden(seriesB),
            'false',
            'Series should not be hidden from AT'
        );

        seriesB.hide();

        assert.strictEqual(
            getSeriesAriaHidden(seriesA),
            'false',
            'Series should still not be hidden from AT'
        );
        assert.strictEqual(
            getSeriesAriaHidden(seriesB),
            'true',
            'Series should be hidden from AT'
        );

        chart.series[0].update({
            name: 'Bean sprouts'
        });

        assert.notStrictEqual(
            chart.series[0].a11yProxyElement.buttonElement.getAttribute('aria-label').indexOf('Bean'),
            -1,
            '#15902: Proxy button aria-label should have been updated'
        );

        const added = chart.addSeries({ data: [1, 2, 3] });

        assert.ok(
            added.a11yProxyElement.buttonElement,
            '#15902: New legend item should have proxy button'
        );

        added.remove();

        assert.strictEqual(
            chart.accessibility.proxyProvider.groups
                .legend.proxyElements.length,
            2,
            '#15902: Proxy items should be recreated after removing legend item'
        );
    }
);
