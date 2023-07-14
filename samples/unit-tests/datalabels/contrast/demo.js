QUnit.test(
    '#6487: Column\'s data label with contrast after justification.',
    function (assert) {
        const chart = Highcharts.chart('container', {
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
                series: [
                    {
                        data: [15, 14.5, 14, 12, 11, 10, 9, 8, 7, 6, 5, 4]
                    }
                ],
                yAxis: {
                    endOnTick: false,
                    max: 15.3
                }
            }),
            point = chart.series[0].points[1];

        assert.strictEqual(
            Highcharts.color(
                point.dataLabel.element.childNodes[0].style.color
            ).get(),
            Highcharts.color(chart.renderer.getContrast(point.color)).get(),
            'Contrast color should be used for a justified label on a column.'
        );

        chart.yAxis[0].setExtremes(null, 20000000, false, false);
        chart.addSeries({
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000000]
        });

        assert.strictEqual(
            Highcharts.color(
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
            chart.series[1].points[11].dataLabel.element.childNodes[0].style
                .color,
            'red',
            `After updating from contrast color,
            label should have new color (#12500)`
        );

        chart.series[1].remove(false);
        chart.update({
            chart: {
                type: 'bar',
                backgroundColor: '#000000'
            },
            series: [{
                data: [100],
                dataLabels: {
                    enabled: true,
                    format: 'Some long long long long long long long long text'
                }
            }]
        }, false);
        chart.yAxis[0].setExtremes(null, 1000);

        const points = chart.series[0].points;

        assert.strictEqual(
            Highcharts.color(
                points[0].dataLabel.element.childNodes[0].style.color
            ).get(),
            Highcharts.color(
                'rgb(255,255,255)'
            ).get(),
            `If background of chart is dark dataLabels outside the bar chart
            should get the contrast (white) color (#17413).`
        );

        chart.update({
            chart: {
                plotBackgroundColor: '#ffffff'
            }
        });

        assert.strictEqual(
            Highcharts.color(
                points[0].dataLabel.element.childNodes[0].style.color
            ).get(),
            Highcharts.color(
                'rgb(0,0,0)'
            ).get(),
            `If background of chart is dark, but plot background color is light
            dataLabels outside the bar chart should get the contrast (black) 
            color (#17413).`
        );

        chart.update({
            chart: {
                backgroundColor: '#ffffff',
                plotBackgroundColor: '#000000'
            }
        });

        assert.strictEqual(
            Highcharts.color(
                points[0].dataLabel.element.childNodes[0].style.color
            ).get(),
            Highcharts.color(
                'rgb(255,255,255)'
            ).get(),
            `If background of chart is light, but plot background color is dark
            dataLabels outside the bar chart should get the contrast (black)
            color (#17413).`
        );
    }
);

QUnit.test('Pie dataLabels and contrast', function (assert) {
    const chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    dataLabels: {
                        inside: true,
                        enabled: true
                    }
                }
            },
            series: [
                {
                    type: 'pie',
                    data: [86, 5]
                }
            ]
        }),
        points = chart.series[0].points;

    assert.strictEqual(
        Highcharts.color(
            points[1].dataLabel.element.childNodes[0].style.color
        ).get(),
        Highcharts.color(
            points[0].dataLabel.element.childNodes[0].style.color
        ).get(),
        'DataLabels outside the pie chart should not get contrast color (#11140).'
    );
});