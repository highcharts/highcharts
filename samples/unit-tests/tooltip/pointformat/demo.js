QUnit.test('Repetetive formats', function (assert) {
    Highcharts.setOptions({
        lang: {
            decimalPoint: ','
        }
    });

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column',
            width: 200,
            height: 200
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '{point.y} - {point.y}',
            valuePrefix: 'NOK '
        },
        series: [{
            data: [1.11]
        }]
    });

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'NOK 1,11 - NOK 1,11',
        'Formatting should be preserved when repeated (#8101)'
    );

    // Reset
    Highcharts.setOptions({
        lang: {
            decimalPoint: '.'
        }
    });
});
