$(function () {
    QUnit.test("Heatmap point size shouldn't overflow plot area", function (assert) {
        var chart = new Highcharts.Chart({

            chart: {
                type: 'heatmap',
                renderTo: 'container',
                width: 400,
                height: 400
            },

            series: [{
                data: [[
                    Date.UTC(2012, 12, 2),
                    0,
                    93
                ]/*, [
                    Date.UTC(2012, 12, 3),
                    0,
                    1
                ]*/],
                colsize: 24 * 3600 * 1000,
                rowsize: 24 * 3600 * 1000
            }]
        });

        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('width'), 10) < 400,
            true,
            'Element width is acceptable'
        );

        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('height'), 10) < 400,
            true,
            'Element height is acceptable'
        );




        chart = new Highcharts.Chart({

            chart: {
                type: 'heatmap',
                renderTo: 'container',
                width: 400,
                height: 400,
                inverted: true
            },

            series: [{
                data: [[
                    Date.UTC(2012, 12, 2),
                    0,
                    93
                ]/*, [
                    Date.UTC(2012, 12, 3),
                    0,
                    1
                ]*/],
                colsize: 24 * 3600 * 1000,
                rowsize: 24 * 3600 * 1000
            }]
        });

        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('width'), 10) < 400,
            true,
            'Element width is acceptable'
        );

        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('height'), 10) < 400,
            true,
            'Element height is acceptable'
        );






        chart = new Highcharts.Chart({

            chart: {
                type: 'heatmap',
                renderTo: 'container',
                width: 400,
                height: 400,
                inverted: true
            },

            xAxis: {
                minRange: 1
            },

            series: [{
                data: [[
                    Date.UTC(2012, 12, 2),
                    0,
                    93
                ]/*, [
                    Date.UTC(2012, 12, 3),
                    0,
                    1
                ]*/],
                colsize: 24 * 3600 * 1000,
                rowsize: 24 * 3600 * 1000
            }]
        });

        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('width'), 10) < 400,
            true,
            'With minRange: Element width is acceptable'
        );

        assert.strictEqual(
            parseInt(chart.series[0].points[0].graphic.attr('height'), 10) < 400,
            true,
            'With minRange: Element height is acceptable'
        );
    });

});