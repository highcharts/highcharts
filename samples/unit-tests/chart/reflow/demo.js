

QUnit.test('Reflow tests (sync, #6968)', function (assert) {

    var clock,
        chart,
        originalChartWidth,
        container = document.getElementById('container'),
        originalContainerWidth = container.offsetWidth;

    try {

        clock = TestUtilities.lolexInstall();

        var done = assert.async();

        // Set reflow to false
        setTimeout(function () {

            assert.ok(true, 'Test set reflow to false');

            chart = Highcharts.chart('container', {
                chart: {
                    reflow: false
                },
                title: {
                    text: 'Chart reflow is set to false'
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },

                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }]
            });

            originalChartWidth = chart.chartWidth;

            assert.strictEqual(
                typeof originalChartWidth,
                'number',
                'Width should be set'
            );

            // Change the container size and trigger window resize to make the chart resize
            container.style.width = '300px';
            window.dispatchEvent(new Event('resize'));

        }, 0);

        setTimeout(function () {

            assert.notEqual(
                container.offsetWidth,
                originalContainerWidth,
                'Container width should change'
            );

            assert.strictEqual(
                chart.chartWidth,
                originalChartWidth,
                'Chart width should not change'
            );

            container.style.width = '';
            container.style.height = '';

        }, 100);

        // Set reflow to true
        setTimeout(function () {

            assert.ok(true, 'Test set reflow to true');

            chart = Highcharts.chart('container', {
                chart: {
                    reflow: true
                },
                title: {
                    text: 'Chart reflow is set to false'
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }]
            });

            originalChartWidth = chart.chartWidth;

            assert.strictEqual(
                typeof originalChartWidth,
                'number',
                'Chart width should be set'
            );

            // Change the container size and trigger window resize to make the chart resize
            container.style.width = '300px';
            chart.reflow();

        }, 200);

        setTimeout(function () {

            assert.strictEqual(
                chart.chartWidth !== originalChartWidth,
                true,
                'Chart width should change'
            );

            container.style.width = '';
            container.style.height = '';

        }, 300);

        // Reflow height only (#6968)
        setTimeout(function () {

            assert.ok(true, 'Test reflow height only (#6968)');

            chart = Highcharts.chart('container', {
                chart: {
                    animation: false,
                    width: 500
                },
                series: [{
                    type: 'column',
                    data: [1, 3, 2, 4]
                }]
            });

            assert.strictEqual(
                chart.chartHeight,
                400,
                'Default height'
            );

            container.style.height = '500px';
            chart.reflow();

            assert.strictEqual(
                chart.chartHeight,
                500,
                'Reflowed height'
            );

            container.style.width = '';
            container.style.height = '';

            done();

        }, 400);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }

});