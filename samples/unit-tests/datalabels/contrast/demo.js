QUnit.test('#6487: Column\'s data label with contrast after justification.', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 400,
                type: 'column'
            },
            plotOptions: {
                column: {
                    colorByPoint: true,
                    dataLabels: {
                        enabled: true,
                        inside: false,
                        style: {
                            textOutline: null
                        }
                    }
                }
            },
            series: [{
                data: [15, 14.5, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4]
            }],
            yAxis: {
                endOnTick: false,
                max: 15.3
            }
        }),
        point = chart.series[0].points[1];

    assert.strictEqual(
        Highcharts.Color(
            point.dataLabel.element.childNodes[0].style.color
        ).get(),
        Highcharts.Color(
            chart.renderer.getContrast(point.color)
        ).get(),
        'Contrast color should be used for a justified label on a column.'
    );

    chart.yAxis[0].setExtremes(null, 20000000, false, false);
    chart.addSeries({
        data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000000]
    });

    assert.strictEqual(
        Highcharts.Color(
            point.dataLabel.element.childNodes[0].style.color
        ).get(),
        'rgb(0,0,0)',
        `Contrast color should not be used when dataLabel does not collide  
            with column (#6657).`
    );

    chart.series[1].update({
        dataLabels: {
            inside: true,
            color: 'red'
        }
    });
    assert.strictEqual(
        chart.series[1].points[11].dataLabel.element.childNodes[0].style.color,
        'red',
        `After updating from contrast color,
            label should have new color (#12500)`
    );
});

QUnit.test('Pie dataLabels and contrast', function (assert) {
    var chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    dataLabels: {
                        inside: true,
                        enabled: true
                    }
                }
            },
            series: [{
                type: 'pie',
                data: [86, 5]
            }]
        }),
        points = chart.series[0].points;

    assert.strictEqual(
        Highcharts.Color(
            points[1].dataLabel.element.childNodes[0].style.color
        ).get(),
        Highcharts.Color(
            points[0].dataLabel.element.childNodes[0].style.color
        ).get(),
        'DataLabels outside the pie chart should not get contrast color (#11140).'
    );
});
