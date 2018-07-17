
QUnit.test(
    'Update colorAxis through chart.update (#3936)',
    function (assert) {

        var config = {
            colorAxis: {
                minColor: '#ff0',
                maxColor: '#f0f',
                labels: {
                    style: {
                        fontSize: '10px'
                    }
                },
                min: 0,
                max: 10
            },
            series: [{
                type: 'treemap',
                data: [{
                    value: 6,
                    colorValue: 0
                }, {
                    value: 6,
                    colorValue: 2
                }, {
                    value: 4,
                    colorValue: 3
                }, {
                    value: 3,
                    colorValue: 4
                }, {
                    value: 2,
                    colorValue: 5
                }, {
                    value: 2,
                    colorValue: 6
                }, {
                    value: 1,
                    colorValue: 10
                }]
            }]
        };

        var chart = Highcharts.chart(
            $('<div>').appendTo('#container')[0],
            Highcharts.merge(config)
        );

        // Update colorAxis
        chart.update({
            colorAxis: {
                minColor: '#0f0',
                maxColor: '#00f',
                labels: {
                    style: {
                        fontSize: '15px'
                    }
                }
            }
        });

        assert.strictEqual(
            chart.series[0].points[0].color,
            "rgb(0,255,0)",
            'colorAxis.minColor updated'
        );

        assert.strictEqual(
            chart.series[0].points[6].color,
            "rgb(0,0,255)",
            'colorAxis.maxColor updated'
        );

        assert.strictEqual(
            $('.highcharts-coloraxis-labels text').css('font-size'),
            '15px',
            'colorAxis.labels.style.fontSize updated'
        );

    }
);

QUnit.test('Update with data classes (#6632)', function (assert) {
    var c = Highcharts.mapChart('container', {
        colorAxis: {
            dataClasses: [{
                "to": 3
            }, {
                "from": 3
            }]
        },
        series: [{
            data: [{
                path: 'M 0 0 L 100 0 L 0 100',
                value: 2
            }, {
                path: 'M 100 0 L 100 100 L 0 100',
                value: 2
            }]
        }]
    });

    assert.strictEqual(
        Highcharts.color(c.series[0].points[0].color).get(),
        Highcharts.color(c.colorAxis[0].options.minColor).get(),
        'Initial color'
    );

    c.update({
        legend: {
            title: {
                "text": "Individuals per km²"
            }
        },
        colorAxis: {
            dataClasses: [{
                "to": 1
            }, {
                "from": 1
            }]
        }
    });

    assert.strictEqual(
        Highcharts.color(c.series[0].points[0].color).get(),
        Highcharts.color(c.colorAxis[0].options.maxColor).get(),
        'Updated color'
    );

});
