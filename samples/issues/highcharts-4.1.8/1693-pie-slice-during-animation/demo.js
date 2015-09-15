$(function () {
    // Note: QUnit.asyncTest() is deprected as of QUnit v2.0.0
    QUnit.asyncTest("point.slice() should allow to finish initial animation.", function (assert) {
        var time = 1000,
            chart = $('#container').highcharts({
                chart: {
                    type: 'pie',
                    animation: {
                        duration: time
                    }
                },
                series: [{
                    animation: {
                        duration: time
                    },
                    data: [29.9, 71.5, 106.4]
                }]
            }, function(chart) {
                chart.series[0].data[1].slice();
            }).highcharts();

        setTimeout(function() {
            var box = chart.series[0].data[1].graphic.getBBox(true);
            assert.strictEqual(
                box.width > 1,
                true,
                "Proper slice's shape"
            );
            QUnit.start();
        }, time + 1);
    });


    // For QUnit v2.0.0+ use below test: 
    /*
    QUnit.test("point.slice() should allow to finish initial animation.", function (assert) {
        var done = assert.async(),    
            time = 1000,
            chart = $('#container').highcharts({
                chart: {
                    type: 'pie',
                    animation: {
                        duration: time
                    }
                },
                series: [{
                    animation: {
                        duration: time
                    },
                    data: [29.9, 71.5, 106.4]
                }]
            }, function(chart) {
                chart.series[0].data[1].slice();
            }).highcharts();

        setTimeout(function() {
            var box = chart.series[0].data[1].graphic.getBBox(true);
            assert.strictEqual(
                box.width > 1,
                true,
                "Proper slice's shape"
            );
            done();
        }, time + 1);
    });    
    */
});