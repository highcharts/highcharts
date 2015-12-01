$(function () {
    QUnit.test('Pie with zeroes', function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                type: 'pie',
                borderColor: 'green',
                data: [
                    ['Firefox',   0],
                    ['IE',      0],
                    ['Safari',    0],
                    ['Opera',     0],
                    ['Others',   0]
                ]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].points[0].graphic instanceof Highcharts.SVGElement,
            true,
            'Has graphic'
        );
        assert.strictEqual(
            chart.series[0].points[0].connector instanceof Highcharts.SVGElement,
            true,
            'Has connector'
        );
        assert.strictEqual(
            chart.series[0].points[0].dataLabel instanceof Highcharts.SVGElement,
            true,
            'Has data label'
        );

    });

    QUnit.test('Pie with nulls', function (assert) {
        var chart = $('#container').highcharts({
            series: [{
                type: 'pie',
                borderColor: 'green',
                data: [
                    ['Firefox',   null],
                    ['IE',      null],
                    ['Safari',    null],
                    ['Opera',     null],
                    ['Others',   null]
                ]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].points[0].graphic,
            undefined,
            'No graphic'
        );
        assert.strictEqual(
            chart.series[0].points[0].connector,
            undefined,
            'No connector'
        );
        assert.strictEqual(
            chart.series[0].points[0].dataLabel,
            undefined,
            'No data label'
        );

    });

});