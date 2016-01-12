$(function () {
    QUnit.test('Columnrange series should work with broken-axis.', function (assert) {
        var iter = 0,
            chart = $('#container').highcharts({
                chart: {
                    type: 'columnrange'
                },
                yAxis: {
                    breaks: [{
                        from: 10, 
                        to: 20
                    }],
                    events: {
                        pointBreak: function() {
                            iter ++;
                        }
                    }
                },
                series: [{
                    data:[[0, 5, 15], [1, 0, 30]]
                }]
            }).highcharts();

        assert.strictEqual(
            iter,
            1,
            'pointBreak called'
        );
    });
});