QUnit.test(
    'Tooltip has correct classes when className is supplied',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                styledMode: true
            },
            series: [{
                className: 'oranges',
                data: [
                    1,
                    {
                        className: 'blood-orange',
                        y: 4
                    },
                    7]
            }, {
                name: 'Apples',
                className: 'apples',
                data: [
                    0,
                    3,
                    0]
            }]
        });
        const point = chart.series[0].points[0];
        const container = chart.container;
        const controller = new TestController(chart);

        controller.moveTo(
            chart.plotLeft + point.plotX,
            chart.plotTop + point.plotY
        );

        assert.strictEqual(
            container.getElementsByClassName(
                'highcharts-label highcharts-tooltip ' +
                'highcharts-color-0 oranges'
            ).length,
            1,
            'Tooltip with correct classes should exist'
        );

        chart.update({
            tooltip: {
                shared: true
            }
        });
        controller.moveTo(
            chart.plotLeft + point.plotX,
            chart.plotTop + point.plotY
        );

        assert.strictEqual(
            container.getElementsByClassName(
                'highcharts-label highcharts-tooltip ' +
                'highcharts-color-0 oranges'
            ).length,
            1,
            'Tooltip with correct classes should exist'
        );

        chart.update({
            tooltip: {
                split: true
            }
        });
        controller.moveTo(
            chart.plotLeft + point.plotX,
            chart.plotTop + point.plotY
        );

        assert.strictEqual(
            container.getElementsByClassName(
                'highcharts-label highcharts-tooltip-box ' +
                'highcharts-color-0 oranges'
            ).length,
            1,
            'Split tooltip with correct classes should exist for single series'
        );

    }
);
