$(function () {
    QUnit.test('Log axis extremes, issue #934', function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                height: 400
            },
            yAxis: {
                min: 1000,
                max: 1000000000,
                type: 'logarithmic',
                tickInterval: 1
            },
            series: [{
                data: [
                    10000,
                    8900]
            }, {
                data: [
                    8600,
                    7700]
            }]
        });

        var ext = chart.yAxis[0].getExtremes();
        assert.strictEqual(
            ext.min,
            1000,
            'Min is 1000'
        );

        assert.strictEqual(
            ext.max,
            1000000000,
            'Max is 1000000000'
        );

    });


    QUnit.test('Log axis extremes, issue #4360', function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Title'
                },
                type: 'logarithmic'
            },
            series: [{
                name: "Brands",
                colorByPoint: true,
                data: [{
                    name: "A",
                    y: 30
                },
                    {
                        name: "B",
                        y: 0
                    }]
            }]
        });

        assert.strictEqual(
            chart.yAxis[0].ticks[chart.yAxis[0].tickPositions[0]].label.textStr,
            '30',
            'Label is 30'
        );

    });
});