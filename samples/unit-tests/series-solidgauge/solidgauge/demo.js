QUnit.test('tooltip', function (assert) {
    assert.strictEqual(
        Highcharts.seriesTypes.solidgauge.prototype.noSharedTooltip,
        true,
        'noSharedTooltip: true. #5354'
    );
});

QUnit.test('Solid gauge yAxis.update (#5895)', function (assert) {
    var gaugeOptions = {
        chart: {
            type: 'solidgauge',
            animation: false
        },

        title: null,

        tooltip: {
            enabled: false
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
            max: 200,
            title: {
                text: 'Speed'
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Speed',
            data: [80]
        }]

    }));

    assert.strictEqual(
        Highcharts.color(chart.series[0].points[0].graphic.attr('fill')).get(),
        'rgb(0,255,0)',
        'Initially green'
    );

    chart.yAxis[0].update({
        stops: [
            [0, '#ff0000'], // red
            [1, '#ff0000'] // red
        ]
    }, true);

    assert.strictEqual(
        Highcharts.color(chart.series[0].points[0].graphic.attr('fill')).get(),
        'rgb(255,0,0)',
        'Updated to red'
    );

    chart.yAxis[0].update({
        stops: [
            [0, '#0000ff'],
            [1, '#0000ff']
        ]
    }, true);

    assert.strictEqual(
        Highcharts.color(chart.series[0].points[0].graphic.attr('fill')).get(),
        'rgb(0,0,255)',
        'Updated again'
    );


});


QUnit.test('Solid gauge animated color', function (assert) {

    var done = assert.async();

    var chart = Highcharts.chart('container', {
        chart: {
            type: 'solidgauge',
            animation: {
                duration: 50
            }
        },

        title: null,

        tooltip: {
            enabled: false
        },

        yAxis: {
            stops: [
                [0, '#000000'],
                [1, '#ffffff']
            ],
            min: 0,
            max: 100
        },

        series: [{
            name: 'Speed',
            data: [10]
        }]

    });

    var point = chart.series[0].points[0];
    assert.strictEqual(
        Highcharts.color(point.graphic.element.getAttribute('fill')).get(),
        Highcharts.color('rgb(26,26,26)').get(),
        'Initial color'
    );

    point.update(50);
    setTimeout(function () {
        assert.strictEqual(
            Highcharts.color(point.graphic.element.getAttribute('fill')).get(),
            Highcharts.color('rgb(128,128,128)').get(),
            'Updated color'
        );

        done();
    }, 200);



});
