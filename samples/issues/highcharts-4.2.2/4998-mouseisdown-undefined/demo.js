jQuery(function () {

    QUnit.test('JS error on hovering after destroy chart', function (assert) {
        var chart,
            options = {

                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },

                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    type: 'column'
                }]

            };

        chart = Highcharts.chart('container', options);

        chart.pointer.onContainerMouseMove({
            pageX: 200,
            pageY: 200,
            type: 'mousemove'
        });
        assert.ok(
            true,
            'No error yet'
        );

        // Create a new chart
        chart = Highcharts.chart('container', options);

        chart.pointer.onContainerMouseMove({
            pageX: 200,
            pageY: 200,
            type: 'mousemove'
        });
        assert.ok(
            true,
            'No error'
        );
    });
});