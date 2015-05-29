$(function () {

    QUnit.test('Navigator', function (assert) {
        var chart = new Highcharts.StockChart({
            chart: {
                renderTo: 'container',
                width: 400,
                height: 300
            },
            navigator: {
                xAxis: {
                    type: 'datetime',
                    ordinal: false,
                    min: Date.UTC(2015, 0, 28),
                    max: Date.UTC(2015, 1, 26)
                },
                series: {
                    data: [
                        [Date.UTC(2015, 0, 21), 0.1],
                        [Date.UTC(2015, 0, 30), 2.84],
                        [Date.UTC(2015, 1, 2), 2.79],
                        [Date.UTC(2015, 1, 3), 2.79],
                        [Date.UTC(2015, 1, 4), 3.04],
                        [Date.UTC(2015, 1, 5), 3.04],
                        [Date.UTC(2015, 1, 10), 1.70],
                        [Date.UTC(2015, 1, 11), 1.67]
                    ]
                }
            },
            xAxis: {
                type: 'datetime',
                ordinal: false,
                min: Date.UTC(2015, 0, 28),
                max: Date.UTC(2015, 1, 26)
            },
            series: [{
                name: 'Serie1',
                data: [
                    [Date.UTC(2015, 0, 21), 0.1],
                    [Date.UTC(2015, 0, 30), 2.84],
                    [Date.UTC(2015, 1, 2), 2.79],
                    [Date.UTC(2015, 1, 3), 2.79],
                    [Date.UTC(2015, 1, 4), 3.04],
                    [Date.UTC(2015, 1, 5), 3.04],
                    [Date.UTC(2015, 1, 10), 1.70],
                    [Date.UTC(2015, 1, 11), 1.67]
                ]
            }]
        });

        // Assert that the first series' points are not destroyed
        assert.equal(
            chart.scroller.xAxis.min,
            Date.UTC(2015, 0, 28),
            'Navigator min'
        );
    });
});