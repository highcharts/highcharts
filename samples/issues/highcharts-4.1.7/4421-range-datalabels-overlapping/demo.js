$(function () {
    QUnit.test('Range series data labels', function (assert) {

        var data = [],
            i;
        for (i = 0; i < 100; i++) {
            data.push([i, i + 100]);
        }

        $('#container').highcharts({
            chart: {
                type: 'arearange'
            },
            rangeSelector: {
                selected: 0
            },
            series: [{
                data: data,
                dataLabels: {
                    enabled: true
                }
            }]

        });

        var chart = $('#container').highcharts();

        assert.strictEqual(
            chart.series[0].points[0].dataLabelUpper.attr('opacity'),
            1,
            'First label visible'
        );
        assert.strictEqual(
            chart.series[0].points[1].dataLabelUpper.attr('opacity'),
            0,
            'Second label hidden'
        );

    });
});