$(function () {
    QUnit.test('Whiskers set by number and by percentage (string)', function (assert) {

        $('#container').highcharts({
            chart: {
                type: 'boxplot',
                width: 405
            },
            plotOptions: {
                series: {
                    grouping: false
                }
            },
            series: [{
                whiskerLength: '50%',
                pointWidth: 50,
                data: [
                    [760, 801, 848, 895, 965],
                    [760, 801, 848, 895, 965]
                ]
            },{
                whiskerLength: 42,
                data: [
                    [2, 760, 801, 848, 895, 965]
                ]
            }]
        });

        var chart = $('#container').highcharts();

        assert.strictEqual(
            chart.series[0].points[0].whiskers.getBBox(true).width,
            25,
            'whiskerLength set by percent'
        );
        assert.strictEqual(
            chart.series[1].points[0].whiskers.getBBox(true).width,
            42,
            'whiskerLength set by number'
        );

    });
});