QUnit.test(
    'Legend symbol events when useHTML: true (#6553)',
    function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'area'
                },
                legend: {
                    useHTML: true
                },
                series: [
                    {
                        name: 'Installation 1',
                        data: [1]
                    },
                    {
                        name: 'Installation 2',
                        data: [2]
                    },
                    {
                        name: 'Installation 3',
                        data: [3]
                    }
                ]
            }),
            test = TestController(chart),
            series = chart.series[0],
            legendGroup = chart.legend.group,
            bbox = series.legendItem.symbol.getBBox(true),
            seriesLegendGroup = series.legendItem.group,
            x =
                seriesLegendGroup.translateX +
                legendGroup.translateX +
                bbox.x +
                bbox.width / 2,
            y =
                seriesLegendGroup.translateY +
                legendGroup.translateY +
                bbox.y +
                bbox.height / 2;

        test.click(x, y);

        assert.strictEqual(
            chart.series[0].visible,
            false,
            'Hide series on legend item symbol click when useHTML: true'
        );
    }
);
