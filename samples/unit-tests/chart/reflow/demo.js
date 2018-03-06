/* eslint func-style:0 */

QUnit.test('Set reflow to false', function (assert) {

    var chart = Highcharts
        .chart('container', {
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
        }),
        chartWidth = chart.chartWidth,
        containerWidth = $('#container').width(),
        done = assert.async();

    assert.strictEqual(
        typeof chartWidth,
        'number',
        'Width should be set'
    );

    var clock = null;

    try {

        clock = lolexInstall(chart);

        // Change the container size and trigger window resize to make the chart resize
        $('#container').width(300);
        $(window).resize();

        setTimeout(function () {
            assert.notEqual(
                containerWidth,
                $('#container').width(),
                'Container width should change'
            );
            assert.strictEqual(
                chart.chartWidth,
                chartWidth,
                'Chart width should not change'
            );
            done();
        }, 200);

        lolexRunAndUninstall(clock);

    } finally {

        lolexUninstall(clock);
        $('#container').width(containerWidth);

    }
});

QUnit.test('Set reflow to true', function (assert) {

    var chart = Highcharts
        .chart('container', {
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
        }),
        chartWidth = chart.chartWidth,
        containerWidth = $('#container').width(),
        done = assert.async();

    assert.strictEqual(
        typeof chartWidth,
        'number',
        'Width should be set'
    );

    var clock = null;

    try {

        clock = lolexInstall(chart);

        // Change the container size and trigger window resize to make the chart resize
        $('#container').width(300);
        Highcharts.fireEvent(window, 'resize');

        setTimeout(function () {
            assert.strictEqual(
                chart.chartWidth === chartWidth,
                false,
                'Width should change'
            );
            done();
        }, 200);

        lolexRunAndUninstall(clock);

    } finally {

        lolexUninstall(clock);
        $('#container').width(containerWidth);

    }
});

QUnit.test('Reflow height only (#6968)', function (assert) {

    var chart = Highcharts
        .chart('container', {
            chart: {
                animation: false,
                width: 500
            },
            series: [{
                type: 'column',
                data: [1, 3, 2, 4]
            }]
        }),
        container = document.getElementById('container');
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
});