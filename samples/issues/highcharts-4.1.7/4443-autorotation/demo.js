$(function () {
    QUnit.test('Auto rotation and useHTML', function (assert) {

        $('#container').highcharts({

            chart: {
                width: 1000,
                height: 300
            },

            xAxis: {
                labels:{
                    useHTML:true,
                    autoRotation: [-25]
                },
                categories: [
                    'Jan sad asd asd asd sa',
                    'Feb asd asd sad as as',
                    'Mar sad asd asd asd as'
                ]
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5,7.0, 6.9, 9.5]
            }]
        });

        var chart = $('#container').highcharts(),
            xAxis = chart.xAxis[0];

        assert.strictEqual(
            xAxis.ticks[xAxis.tickPositions[0]].label.rotation,
            0,
            'Initially not rotated'
        );

        chart.setSize(400, 300);
        assert.strictEqual(
            xAxis.ticks[xAxis.tickPositions[0]].label.rotation,
            -25,
            'Rotated'
        );

        chart.setSize(1000, 300);
        assert.strictEqual(
            xAxis.ticks[xAxis.tickPositions[0]].label.rotation,
            0,
            'Not rotated in the end'
        );

    });
});