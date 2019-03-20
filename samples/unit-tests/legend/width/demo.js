QUnit.test(
    'Legend width',
    function (assert) {

        var chart = Highcharts.chart('container', {

            chart: {
                width: 400
            },

            legend: {
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 1
            },

            series: [{
                data: [6, 4, 2],
                name: 'First'
            }, {
                data: [7, 3, 2],
                name: 'Second'
            }, {
                data: [9, 4, 8],
                name: 'Third'
            }, {
                data: [1, 2, 6],
                name: 'Fourth'
            }, {
                data: [4, 6, 4],
                name: 'Fifth'
            }, {
                data: [1, 2, 7],
                name: 'Sixth'
            }, {
                data: [4, 2, 5],
                name: 'Seventh'
            }, {
                data: [8, 3, 2],
                name: 'Eighth'
            }, {
                data: [4, 5, 6],
                name: 'Ninth'
            }]
        });

        assert.ok(
            chart.legend.legendWidth < 300,
            'The default legend width should not exceed half the chart width'
        );

        chart.legend.update({
            title: {
                text: `This legend is long and caused overflow to both sides,
which aside from being bad as of itself had an additional side-effect of
cropping the legend as well.`
            }
        });

        assert.ok(
            chart.legend.legendWidth < 300,
            'The default legend width should not exceed half the chart width'
        );

        chart.legend.update({
            verticalAlign: 'bottom'
        });
        assert.ok(
            chart.legend.legendWidth > 300,
            'The legend has redrawn'
        );

    }
);