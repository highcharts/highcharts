QUnit.test('Solid gauge styled series color (#6350)', function (assert) {

    var gaugeOptions = {
        chart: {
            type: 'solidgauge',
            animation: false
        },

        title: null,

        tooltip: {
            enabled: false
        },

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        // the value axis
        yAxis: {
            stops: [
                [0, '#00ff00'],
                [1, '#00ff00']
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                },
                animation: false
            }
        }
    };

    // The speed gauge
    var chart = Highcharts.chart('container', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 200
        },
        series: [{
            data: [80]
        }]
    }));

    assert.strictEqual(
        chart.series[0].data[0].graphic.element.className.baseVal,
        'highcharts-point highcharts-color-0',
        'Color classes are applied.'
    );

    chart.series[0].points[0].update({ colorIndex: 1 });
    assert.strictEqual(
        chart.series[0].data[0].graphic.element.className.baseVal,
        'highcharts-point highcharts-color-1',
        'Color class should be updated (#8791)'
    );

});
