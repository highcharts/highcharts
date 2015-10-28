$(function () {
    QUnit.test('Ticks were drawn in break', function (assert) {

        $('#container').highcharts({
            title: {
                text: 'Sample of a simple break'
            },
            subtitle: {
                text: 'Line should be interrupted between 5 and 10'
            },
            xAxis: {
                type: 'datetime',
                tickInterval: 1,
                breaks: [{
                    from: 5,
                    to: 10,
                    breakSize: 1
                }],
                labels: {
                    format: '{value}{value}{value}'
                }

            },
            series: [{
                gapSize: 1,
                data: (function () {
                    var data = [],
                        i;
                    for (i = 0; i < 20; i = i + 1) {
                        data.push(i);
                    }
                    return data;
                }())
            }]
        });

        var chart = $('#container').highcharts();

        assert.strictEqual(
            chart.xAxis[0].tickPositions.join(','),
            '0,1,2,3,4,5,10,11,12,13,14,15,16,17,18,19',
            'Skip ticks in break'
        );

    });
});