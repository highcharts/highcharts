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
                    7
                ]
            }, {
                name: 'Apples',
                className: 'apples',
                data: [
                    0,
                    3,
                    0
                ]
            }]
        });
        const point = chart.series[0].points[0];
        const tooltip = chart.tooltip;
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


        chart.update({
            tooltip: {
                split: false,
                shared: false,
                outside: true,
                useHTML: true
            }
        });

        tooltip.refresh(point);

        const before = tooltip.label.height;

        tooltip.hide();

        // Headless doesn't compute nested styles in CSS file, so it needs to be
        // appended via JS
        const style = document.createElement('style');
        style.innerHTML = '.custom span { padding: 10px; }';
        document.head.appendChild(style);

        chart.update({
            tooltip: {
                className: 'custom'
            }
        });

        tooltip.refresh(point);

        assert.ok(
            chart.tooltip.label.hasClass('custom'),
            'Provided className should be added to the tooltip label, #20459.'
        );

        assert.strictEqual(
            chart.tooltip.label.height,
            before + 20,
            'Tooltip label height reflects style from custom CSS class, #20459.'
        );

    }
);
