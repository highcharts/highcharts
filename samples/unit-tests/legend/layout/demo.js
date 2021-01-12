QUnit.test('Legend layout', function (assert) {
    var chart = Highcharts.chart('container', {
        legend: {
            layout: 'proximate',
            align: 'right'
        },

        yAxis: [
            {},
            {
                top: '50%',
                height: '50%'
            }
        ],

        series: [
            {
                data: [1, 1, 1]
            },
            {
                data: [2, 2, 2]
            },
            {
                data: [4, 4, 4]
            },
            {
                data: [null, null, null] // #8638
            },
            {
                yAxis: 1,
                data: [1, 1, 1], // #10063
                name: 'Positioned Axis'
            }
        ]
    });

    chart.series.forEach(function (s) {
        var y = s.points[2].plotY || s.yAxis.height;

        assert.close(
            s.legendGroup.translateY,
            s.yAxis.top - chart.spacing[0] + y,
            20,
            'Label should be next to last point'
        );
    });

    chart.series[1].setData([1, 1, 1]);
    assert.ok(
        Math.abs(
            chart.series[0].legendGroup.translateY -
                chart.series[1].legendGroup.translateY
        ) > 12,
        'The overlapping items should have sufficient distance'
    );

    chart.legend.update({
        useHTML: true
    });

    assert.ok(
        Math.abs(
            chart.series[0].legendGroup.translateY -
                chart.series[1].legendGroup.translateY
        ) > 12,
        'The overlapping items should have sufficient distance with useHTML (#12055)'
    );

    chart.legend.update({
        itemMarginTop: 10,
        itemMarginBottom: 10,
        useHTML: false
    });

    assert.ok(
        Math.abs(
            chart.series[0].legendGroup.translateY -
                chart.series[1].legendGroup.translateY
        ) > 30,
        'The overlapping items should have sufficient distance when an item margin is applied'
    );
});

QUnit.test('Proximate layout and dataGrouping', assert => {
    const chart = new Highcharts.chart('container', {
        chart: {
            animation: false
        },
        legend: {
            align: 'right',
            layout: 'proximate'
        },
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: true,
                    forced: true
                }
            }
        },
        series: [
            {
                data: [
                    [Date.UTC(2019, 0, 1, 20, 10), 10],
                    [Date.UTC(2019, 0, 1, 20, 15), 11],
                    [Date.UTC(2019, 0, 1, 20, 23), 12],
                    [Date.UTC(2019, 0, 1, 20, 44), 13],
                    [Date.UTC(2019, 0, 1, 20, 56), 14]
                ]
            },
            {
                data: [
                    [Date.UTC(2019, 0, 1, 20, 10), 10],
                    [Date.UTC(2019, 0, 1, 20, 15), 11],
                    [Date.UTC(2019, 0, 1, 20, 23), 12],
                    [Date.UTC(2019, 0, 1, 20, 44), 13],
                    [Date.UTC(2019, 0, 1, 20, 56), 14]
                ]
            }
        ]
    });

    chart.series[1].hide();

    // Avoid using strict position as it may vary between browsers
    assert.ok(
        chart.series[1].legendGroup.translateY > chart.plotHeight / 2,
        `Legend item for a hidden series should be placed at the bottom
            of chart even when dataGrouping is enabled (#13813).`
    );
});
