$(function () {
    function generateData(n, k) {
        var data = [];
        while (n--) {
            data.push(Math.random() + k);
        }
        return data;
    }

    QUnit.test('Shared tooltip should always highlight all markers.', function (assert) {
        var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'
                },
                tooltip: {
                    shared: true
                },
                series: [{
                    data: generateData(500, 0)
                }, {
                    data: generateData(500, 10)
                }]
            }),
            offset = $('#container').offset(),
            left = offset.left + chart.plotLeft,
            top = offset.top + chart.plotTop,
            points = chart.series[0].points;

        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[10].plotX,
            pageY: top + points[10].plotY,
            target: points[10].series.group.element
        });
        chart.pointer.onContainerMouseMove({
            type: 'mousemove',
            pageX: left + points[15].plotX,
            pageY: top + points[15].plotY,
            target: points[15].series.group.element
        });

        // I know, checking path is a bit risky,
        // but at this moment, there's no visibility on the halo, only path change
        assert.strictEqual(
            chart.series[0].halo.d !== 'M 0 0',
            true,
            'First series: halo visible.'
        );
        assert.strictEqual(
            chart.series[1].halo.d !== 'M 0 0',
            true,
            'Second series: halo visible.'
        );
    });
});
