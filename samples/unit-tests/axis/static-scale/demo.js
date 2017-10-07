(function () {
    var getPoint = function (i) {
            return {
                name: new Date(Date.now() + i * 1000),
                y: i
            };
        },

        getData = function (dataPoints) {
            var data = [];
            for (var i = 0; i < dataPoints; i++) {
                data.push(getPoint(i));
            }
            return data;
        },

        getSpacing = function (chart) {
            var yAxis = chart.yAxis[0],
                tickIdx = yAxis.tickPositions,
                ticks = yAxis.ticks,
                tick1 = ticks[tickIdx[0]].mark.getBBox().y,
                tick2 = ticks[tickIdx[1]].mark.getBBox().y;

            return tick1 - tick2;
        };

    QUnit.test('Row height does not change with chart update', function (assert) {
        var spaceBefore,
            spaceAfter,
            chart = Highcharts.chart('container', {

                yAxis: {
                    staticScale: 24,
                    tickInterval: 1,
                    tickWidth: 1
                },

                series: [{
                    data: getData(100)
                }]

            });

        spaceBefore = getSpacing(chart);
        chart.update({});

        spaceAfter = getSpacing(chart);
        assert.equal(
            spaceAfter,
            spaceBefore,
            'Space between two first ticks does not change after Chart.update()'
        );
    });

    QUnit.test('Row height does not change with data size', function (assert) {
        var chart1Spacing,
            chart2Spacing,
            chart1,
            chart2;

        chart1 = Highcharts.chart('container', {

            yAxis: {
                staticScale: 24,
                tickInterval: 1,
                tickWidth: 1
            },

            series: [{
                data: getData(300)
            }]

        });
        chart1Spacing = getSpacing(chart1);

        chart2 = Highcharts.chart('container', {

            yAxis: {
                staticScale: 24,
                tickInterval: 1,
                tickWidth: 1
            },

            series: [{
                data: getData(5)
            }]

        });
        chart2Spacing = getSpacing(chart2);

        assert.equal(
            chart2Spacing,
            chart1Spacing,
            'Row height does not change with data size'
        );
    });

    QUnit.test('Row height does not change with axis breaks', function (assert) {
        var chart1Spacing,
            chart2Spacing,
            chart1,
            chart2;

        chart1 = Highcharts.chart('container', {

            yAxis: {
                staticScale: 24,
                tickInterval: 1,
                tickWidth: 1
            },

            series: [{
                data: getData(100)
            }]

        });
        chart1Spacing = getSpacing(chart1);

        chart2 = Highcharts.chart('container', {

            yAxis: {
                staticScale: 24,
                tickInterval: 1,
                tickWidth: 1,
                breaks: [{
                    from: 80,
                    to: 90
                }]
            },

            series: [{
                data: getData(100)
            }]

        });
        chart2Spacing = getSpacing(chart2);

        assert.equal(
            chart2Spacing,
            chart1Spacing,
            'Space between two first ticks does not change with axis breaks'
        );
    });
}());

