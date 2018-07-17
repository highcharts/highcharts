QUnit.test('#6440: Callout dataLabels in an inverted chart points to position.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [{
            type: 'scatter',
            data: [1, 2, 3, 4, 5],
            dataLabels: {
                enabled: true,
                borderWidth: 1,
                borderColor: 'black',
                shape: 'callout',
                format: '{point.x}',
                y: -30,
                x: 40
            }
        }]
    });

    Highcharts.each(chart.series[0].points, function (point) {
        if (point.dataLabel) {
            assert.close(
                point.dataLabel.anchorY,
                chart.xAxis[0].toPixels(point.x, true),
                1,
                'Point: [' + point.x + ', ' + point.y + '] - dataLabels has correct anchorX.'
            );

            assert.close(
                point.dataLabel.anchorX,
                chart.yAxis[0].toPixels(point.y, true),
                1,
                'Point: [' + point.x + ', ' + point.y + '] - dataLabels has correct anchorY.'
            );
        }
    });
});

QUnit.test('#6781: Inverted chart dataLabels placement with Axis.height', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        xAxis: {
            height: 100,
            left: 100,
            min: -5,
            max: 5
        },
        yAxis: {
            width: 100,
            left: 100,
            min: -5,
            max: 5
        },
        series: [{
            dataLabels: {
                enabled: true
            },
            data: [0, 1]
        }]
    });


    Highcharts.each(chart.series[0].points, function (point) {
        if (point.dataLabel) {

            assert.close(
                chart.yAxis[0].toPixels(point.x, true),
                point.dataLabel.translateX,
                10,
                'Point: [' + point.x + ', ' + point.y + '] - dataLabels has correct x-position.'
            );

            assert.close(
                chart.xAxis[0].toPixels(point.y, true),
                point.dataLabel.translateY,
                30, // marker radius and dataLabel font size - it's translated to the top
                'Point: [' + point.x + ', ' + point.y + '] - dataLabels has correct y-position.'
            );
        }
    });
});

