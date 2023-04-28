// Highcharts 4.0.4, Issue #3418
// Tooltip X date format misses when point interval is between units
QUnit.test(
    'Tooltip shown week formats, should be date (#3418)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },
            series: [
                {
                    data: [50, 80, 50, 60],
                    pointStart: Date.UTC(2014, 0, 1),
                    pointInterval: 2 * 24 * 36e5
                }
            ]
        });
        var controller = new TestController(chart),
            series = chart.series[0],
            expectedTexts = [
                'Wednesday,  1 Jan 2014',
                'Friday,  3 Jan 2014',
                'Sunday,  5 Jan 2014',
                'Tuesday,  7 Jan 2014'
            ],
            texts = [],
            pointX = 0,
            pointY = 0,
            textOfTooltip = '';

        function setMouseOnPoint(pointNumber) {
            pointX = series.points[pointNumber].plotX + chart.plotLeft;
            pointY = series.points[pointNumber].plotY + chart.plotTop;
            controller.mouseMove(pointX, pointY, undefined, true);
            textOfTooltip =
                chart.tooltip.label.element.childNodes[1].childNodes[0]
                    .childNodes[0].data;
            texts.push(textOfTooltip);
        }

        setMouseOnPoint(0);
        assert.ok(!chart.tooltip.isHidden, 'Tooltip should be visible');
        setMouseOnPoint(1);
        setMouseOnPoint(2);
        setMouseOnPoint(3);

        assert.deepEqual(
            texts,
            expectedTexts,
            'Tooltip should show expected dates'
        );
    }
);
