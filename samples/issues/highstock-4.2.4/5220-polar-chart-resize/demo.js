$(function () {

    QUnit.test('Polar chart resize', function (assert) {
        var chart;
        $('#container').highcharts({

            chart: {
                polar: true,
                width: 400,
                height: 400
            },

            title: {
                text: 'Highcharts Polar Chart'
            },

            pane: {
                startAngle: 0,
                endAngle: 360
            },

            xAxis: {
                tickInterval: 45,
                min: 0,
                max: 360,
                labels: {
                    formatter: function () {
                        return this.value + '°';
                    }
                }
            },

            yAxis: {
                min: 0
            },

            plotOptions: {
                series: {
                    pointStart: 0,
                    pointInterval: 45
                },
                column: {
                    pointPadding: 0,
                    groupPadding: 0
                }
            },

            series: [{
                type: 'column',
                name: 'Column',
                data: [8, 7, 6, 5, 4, 3, 2, 1],
                pointPlacement: 'between'
            }, {
                type: 'line',
                name: 'Line',
                data: [1, 2, 3, 4, 5, 6, 7, 8]
            }, {
                type: 'area',
                name: 'Area',
                data: [1, 8, 2, 7, 3, 6, 4, 5]
            }]
        });

        chart = $('#container').highcharts();

        assert.strictEqual(
            chart.container.querySelector('svg').getAttribute('width'),
            '400',
            'Chart has correct width'
        );

        chart.setSize(70, 70, false);

        assert.strictEqual(
            chart.container.querySelector('svg').getAttribute('width'),
            '70',
            'Chart has correct width after setSize to smaller'
        );

        chart.setSize(500, 500, false);

        assert.strictEqual(
            chart.container.querySelector('svg').getAttribute('width'),
            '500',
            'Chart has correct width after setSize to larger'
        );

    });
});
