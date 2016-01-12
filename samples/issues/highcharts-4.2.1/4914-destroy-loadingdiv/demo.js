$(function () {
    QUnit.test('Check if loadingDiv is destroyed', function (assert) {
        var chart,
            done = assert.async(2);
        function getData() {
            var data = [];
            for (var i = 0; i < 150000; i++) {
                data.push([i, Math.random() * 5]);
            }
            return data;
        }
        function init() {
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container'
                },
                series: [{
                    data: getData()
                }]
            });
        }
        init();
        // Check if loadingDiv exists
        assert.strictEqual(
            typeof chart.loadingDiv,
            'object',
            'loadingDiv exists'
        );
        setTimeout(function () {
            chart.redraw();
            assert.strictEqual(
                typeof chart.loadingDiv,
                'object',
                'loadingDiv still exists upon redraw'
            );
            setTimeout(function () {
                assert.strictEqual(
                    chart.loadingDiv,
                    null,
                    'loadingDiv is destroyed'
                );
                done();
            }, 1000);
        }, 500);
    });
});