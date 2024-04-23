QUnit.test('Destroy in own callback', function (assert) {
    var done = assert.async();

    Highcharts.chart(
        'container',
        {
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ]
            },
            series: [
                {
                    data: [
                        29.9,
                        71.5,
                        106.4,
                        129.2,
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4
                    ],
                    type: 'column'
                }
            ]
        },
        function () {
            assert.strictEqual(
                typeof this.series,
                'object',
                'Properties available'
            );

            this.destroy();

            /* assert.strictEqual(
            this.series,
            undefined,
            'Properties deleted'
        );

        assert.strictEqual(
            document.getElementById('container').innerHTML,
            '',
            'Container emptied'
        );*/

            done();
        }
    );
});

// Highcharts 4.0.4, Issue #3600: No-data-to-display module broken with
// chart creation in callback
QUnit.test('Destroy in own callback and recreate (#3600)', function (assert) {
    let newChart;

    Highcharts.chart(
        'container',
        {
            chart: {
                test: false
            },
            series: [
                {
                    animation: false,
                    data: [
                        29.9,
                        71.5,
                        106.4,
                        129.2,
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4
                    ]
                }
            ]
        },
        function () {
            var opts = this.options;
            delete opts.chart.test; // run as normal

            this.destroy();

            newChart = Highcharts.chart('container', opts);
            newChart.setTitle({
                text: 'New chart title'
            });
        }
    );

    assert.equal(
        newChart.options.title.text,
        'New chart title',
        'New chart generated'
    );

    newChart = Highcharts.chart('container', {
        tooltip: {
            shared: true
        },
        series: [{
            data: [3, 5, 7]
        }, {
            data: [7, 5, 2]
        }]
    });

    newChart.series[0].points[1].onMouseOver();
    newChart.destroy();

    assert.ok(
        true,
        `Destroy chart with highchare-more during mouse over the point,
        console should be clear #20572.`
    );

    newChart = Highcharts.chart('container', {
        series: [{
            type: 'line',
            data: [1.5, 2.5]
        }, {
            type: 'arearange',
            data: [[1, 2], [2, 3]]
        }]
    });

    newChart.series[1].points[1].onMouseOver();
    newChart.series[0].points[0].onMouseOver();
    newChart.destroy();

    assert.ok(
        true,
        `Chart destroy should be possible without any errors even if the user
        hovers over points during destroy #20560.`
    );
});