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
                point.dataLabel.element.childNodes[0].style.fill
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
                point.dataLabel.element.childNodes[0].style.fill
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
                .fill,
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
                points[0].dataLabel.element.childNodes[0].style.fill
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
                points[0].dataLabel.element.childNodes[0].style.fill
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
                points[0].dataLabel.element.childNodes[0].style.fill
            ).get(),
            Highcharts.color(
                'rgb(255,255,255)'
            ).get(),
            `If background of chart is light, but plot background color is dark
            dataLabels outside the bar chart should get the contrast (black)
            color (#17413).`
        );

        chart.series[0].update({
            dataLabels: {
                backgroundColor: '#fff'
            }
        });

        assert.strictEqual(
            Highcharts.color(
                points[0].dataLabel.element.childNodes[1].style.fill
            ).get(),
            Highcharts.color(
                'rgb(0, 0, 0)'
            ).get(),
            `Prioritize checking the data label background color when the
            color of the data label is specified (#20007).`
        );

        chart.series[0].update({
            color: '#ddd',
            dataLabels: {
                backgroundColor: 'auto'
            }
        });

        assert.strictEqual(
            Highcharts.color(
                points[0].dataLabel.element.childNodes[1].style.fill
            ).get(),
            Highcharts.color(
                'rgb(0, 0, 0)'
            ).get(),
            `When the data label background color is set to 'auto', set the
            data label color by contrast to the point color. (#20007).`
        );

        chart.update({
            chart: {
                backgroundColor: 'transparent'
            },
            series: [{
                data: [1],
                dataLabels: {
                    enabled: true
                }
            }]
        });

        const transparentLabelFill = chart.series[0].points[0]
            .dataLabel.options.style.color;

        assert.strictEqual(
            Highcharts.color(transparentLabelFill).get(),
            Highcharts.color('#000000').get(),
            `When chart background is 'transparent', data label color should
            fall back to black (#transparent-contrast).`
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
        'DataLabels outside the pie chart should not get contrast color ' +
        '(#11140).'
    );
});