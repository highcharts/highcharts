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
        series: [{
            data: [1.11]
        }]
    });

    chart.update({
        tooltip: {
            headerFormat: '',
            pointFormat: '{point.y} - {point.y}',
            valuePrefix: 'NOK '
        }
    });

    chart.series[0].points[0].onMouseOver();
    assert.strictEqual(
        chart.tooltip.label.text.element.textContent,
        'NOK 1,11 - NOK 1,11',
        `Formatting should be preserved when repeated (#8101) and tooltip should
        be updated (#18876).`
    );

    // Reset
    Highcharts.setOptions({
        lang: {
            decimalPoint: '.'
        }
    });
});
