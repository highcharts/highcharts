QUnit.test(
    'Legend events', function (assert) {
        let legendItemClickFlag = false;
        const chart = Highcharts.chart('container', {
                chart: {
                    type: 'area'
                },
                legend: {
                    useHTML: true
                },
                series: [{
                    name: 'Installation 1',
                    data: [1]
                }, {
                    name: 'Installation 2',
                    data: [2]
                }, {
                    name: 'Installation 3',
                    data: [3]
                }]
            }),
            test = TestController(chart),
            series = chart.series[0],
            legendGroup = chart.legend.group,
            bbox = series.legendItem.symbol.getBBox(true),
            seriesLegendGroup = series.legendItem.group,
            x = seriesLegendGroup.translateX +
                legendGroup.translateX +
                bbox.x +
                bbox.width / 2,
            y = seriesLegendGroup.translateY +
                legendGroup.translateY +
                bbox.y +
                bbox.height / 2;

        test.click(x, y, void 0, true);

        const chartOffset = Highcharts.offset(chart.container);
        const elem = document.elementFromPoint(x + chartOffset.left, y);
        const htmlContent = document.documentElement.outerHTML;

        assert.strictEqual(
            chart.series[0].visible,
            false,
            `Hide series on legend item symbol click when useHTML: true
            (#6553).`
        );

        if (chart.series[0].visible) {
            // Failed, so try to get more info
            assert.strictEqual(
                chartOffset,
                'chartOffset',
                'Logging chartOffset'
            );
            assert.strictEqual(
                htmlContent,
                'htmlContent',
                'Logging htmlContent'
            );
            assert.strictEqual(
                elem,
                'elementFromPoint',
                'Logging elementFromPoint'
            );
        }

        chart.legend.update({
            events: {
                itemClick: function () {
                    legendItemClickFlag = true;
                }
            }
        });

        assert.notEqual(
            chart.legend.options.events.itemClick,
            void 0,
            'Legend event item click should be created after update.'
        );

        test.click(x, y);

        assert.ok(
            legendItemClickFlag,
            'Legend item click configures in legend.events should fire.'
        );
    }
);
