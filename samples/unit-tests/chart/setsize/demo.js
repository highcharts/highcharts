/* eslint func-style:0 */
$(function () {

    QUnit.test('setSize parameters', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                animation: false
            },
            series: [{
                type: 'column',
                data: [1, 3, 2, 4]
            }]
        });

        assert.strictEqual(
            chart.chartWidth,
            600,
            'Initial width'
        );

        assert.strictEqual(
            chart.chartHeight,
            400,
            'Initial height'
        );

        // Missing first parameter
        chart.setSize(undefined, 300);

        assert.strictEqual(
            chart.chartWidth,
            600,
            'Width'
        );

        assert.strictEqual(
            chart.chartHeight,
            300,
            'Height'
        );

        // Undefined height => preserve current setting
        chart.setSize(undefined, undefined);

        assert.strictEqual(
            chart.chartWidth,
            600,
            'Width'
        );

        assert.strictEqual(
            chart.chartHeight,
            300,
            'Height'
        );

        // Reset height to auto
        chart.setSize(undefined, null);

        assert.strictEqual(
            chart.chartWidth,
            600,
            'Width'
        );

        assert.strictEqual(
            chart.chartHeight,
            400,
            'Height'
        );

        // Set width
        chart.setSize(300);

        assert.strictEqual(
            chart.chartWidth,
            300,
            'Width'
        );

        assert.strictEqual(
            chart.chartHeight,
            400,
            'Height'
        );

        // Undefined width => preserve current width
        chart.setSize(undefined);

        assert.strictEqual(
            chart.chartWidth,
            300,
            'Width'
        );

        assert.strictEqual(
            chart.chartHeight,
            400,
            'Height'
        );

        // Auto width
        chart.setSize(null);

        assert.strictEqual(
            chart.chartWidth,
            600,
            'Width'
        );

        assert.strictEqual(
            chart.chartHeight,
            400,
            'Height'
        );

        // Test that it responds to reflow
        $('#container').width(700);
        chart.reflow();

        assert.strictEqual(
            chart.chartWidth,
            700,
            'Width'
        );

        assert.strictEqual(
            chart.chartHeight,
            400,
            'Height'
        );

    });

    QUnit.test('3D pies stay in place on redraw (#5350)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                width: 600,
                height: 400,
                borderWidth: 1
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                type: 'pie',
                data: [1, 4, 2, 5]
            }]
        });


        var x = chart.series[0].points[0].graphic.getBBox().x;

        assert.strictEqual(
            typeof x,
            'number',
            'Pie has an X position'
        );

        chart.setSize(400, 400, false);

        assert.ok(
            chart.series[0].points[0].graphic.getBBox().x < x,
            'Pie has moved'
        );


    });

});