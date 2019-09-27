QUnit.test(
    'Legend layout',
    function (assert) {

        var chart = Highcharts.chart('container', {
            legend: {
                layout: 'proximate',
                align: 'right'
            },

            yAxis: [{

            }, {
                top: '50%',
                height: '50%'
            }],

            series: [{
                data: [1, 1, 1]
            }, {
                data: [2, 2, 2]
            }, {
                data: [4, 4, 4]
            }, {
                data: [null, null, null] // #8638
            }, {
                yAxis: 1,
                data: [1, 1, 1], // #10063
                name: 'Positioned Axis'
            }]
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

        chart.series[1].setData(
            [1, 1, 1]
        );
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
    }
);