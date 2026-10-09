QUnit.test('Axis pointPlacement', assert => {
    var chart = Highcharts.chart('container', {
        chart: {
            width: 600,
            zoomType: 'x',
            panning: true,
            panKey: 'shift'
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Bananas', 'Oranges']
        },
        series: [
            {
                data: [
                    [1541688900000, 1],
                    [1541689200000, 1],
                    [1541692800000, 4],
                    [1541696400000, 1],
                    [1541898000000, 1],
                    [1542009600000, 1],
                    [1542013200000, 1],
                    [1542016800000, 1],
                    [1542020400000, 1],
                    [1542038400000, 1]
                ],
                type: 'column',
                pointPlacement: 'on'
            }
        ]
    });

    const axis = chart.xAxis[0];
    const controller = new TestController(chart);

    assert.strictEqual(
        axis.toPixels('2018-11-08 14:55', true), 0, 'No padded ' +
        'ticks'
    );

    assert.strictEqual(
        axis.toPixels('2018-11-12 16:00', true),
        chart.plotWidth,
        'No padded ticks'
    );

    controller.pan([200, 60], [400, 60]);

    const rangeBefore = axis.max - axis.min;
    controller.pan([200, 60], [400, 60], { shiftKey: true });
    assert.close(
        rangeBefore,
        axis.max - axis.min,
        1,
        '#9612: Axis range should not change when panning'
    );

    chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [
            {
                data: [1, 4, 3, 5],
                type: 'column',
                pointPlacement: 'between',
                pointPadding: 0,
                groupPadding: 0
            }
        ]
    });

    var isInsidePlot = true;

    chart.series[0].points.forEach(p => {
        if (isInsidePlot) {
            isInsidePlot = chart.isInsidePlot(
                p.plotX,
                p.plotY,
                { inverted: true }
            );
        }
    });

    assert.ok(
        isInsidePlot,
        'All points are between appropriate ticks when the chart is inverted.'
    );
});

QUnit.test('#14637: Line series pointPlacement="between"', assert => {
    const chart = Highcharts.chart('container', {
        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },
        series: [
            {
                type: 'column',
                data: [5, 3, 4, 7, 2]
            },
            {
                type: 'line',
                data: [3, 5, 6, 2, 9]
            }
        ]
    });

    assert.strictEqual(
        Math.floor(chart.series[1].points[0].plotX),
        Math.floor(chart.xAxis[0].toPixels(0.5, true)),
        'Points should be placed between ticks'
    );
});

QUnit.test('#25477: pointPlacement between gridlines', assert => {
    const data = [1, 4, 3, 5, 2];
    const baseAxis = {
        gridLineWidth: 1,
        max: 4,
        min: 0,
        tickInterval: 1
    };
    const values = [0, 2, 4];

    function placeChart(type, pointPlacement, xAxis) {
        const series = {
            data,
            type
        };

        if (pointPlacement) {
            series.pointPlacement = pointPlacement;
        }

        return Highcharts.chart('container', {
            chart: {
                marginLeft: 50,
                marginRight: 50,
                width: 600
            },
            series: [series],
            xAxis
        });
    }

    function tickPixels(axisChart) {
        const axis = axisChart.xAxis[0];

        return values.map(value => axis.toPixels(value, true));
    }

    const between = placeChart('column', 'between', baseAxis);
    const betweenPixels = tickPixels(between);
    const betweenPlotX = between.series[0].points[0].plotX;
    const shift = between.xAxis[0].transA *
        between.xAxis[0].pointRange / 2;
    const on = placeChart('column', 'on', baseAxis);

    betweenPixels.forEach((pixel, i) => {
        assert.close(
            pixel,
            on.xAxis[0].toPixels(values[i], true),
            1,
            'On and between share tick pixels'
        );
    });
    assert.close(
        betweenPlotX - on.series[0].points[0].plotX,
        shift,
        1,
        'Between sits half a point range to the right'
    );

    const line = placeChart('line', void 0, baseAxis);
    const linePixels = tickPixels(line);

    betweenPixels.forEach((pixel, i) => {
        assert.close(
            pixel,
            linePixels[i],
            1,
            'Line and between share tick pixels'
        );
    });

    const reversedAxis = Highcharts.merge(baseAxis, {
        reversed: true
    });
    const betweenReversed = placeChart(
        'column',
        'between',
        reversedAxis
    );
    const betweenReversedPixels = tickPixels(betweenReversed);
    const betweenReversedPlotX =
        betweenReversed.series[0].points[0].plotX;
    const onReversed = placeChart('column', 'on', reversedAxis);

    betweenReversedPixels.forEach((pixel, i) => {
        assert.close(
            pixel,
            onReversed.xAxis[0].toPixels(values[i], true),
            1,
            'Reversed charts share tick pixels'
        );
    });
    assert.close(
        betweenReversedPlotX - onReversed.series[0].points[0].plotX,
        -onReversed.xAxis[0].transA *
            onReversed.xAxis[0].pointRange / 2,
        1,
        'Reversed between shifts the other way'
    );

    const auto = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        series: [{
            data,
            pointPlacement: 'between',
            type: 'column'
        }]
    });
    const lastPoint = auto.series[0].points[data.length - 1];

    assert.ok(
        lastPoint.plotX >= 0 &&
            lastPoint.plotX <= auto.xAxis[0].len,
        'Last point stays inside the plot'
    );

    const onlyMax = placeChart('column', 'between', {
        max: 4,
        tickInterval: 1
    });
    const paddedTransA = onlyMax.xAxis[0].transA;
    const both = placeChart('column', 'between', {
        max: onlyMax.xAxis[0].max,
        min: onlyMax.xAxis[0].min,
        tickInterval: 1
    });

    assert.ok(
        paddedTransA < both.xAxis[0].transA,
        'A single extreme keeps point range padding'
    );
});
